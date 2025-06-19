let token;
document.addEventListener("DOMContentLoaded", function () {
  initialApp();
  setupSearchListeners();
  setupPlaylistButton();
});

document.addEventListener("DOMContentLoaded", function () {
  const spotifyLoginBtn = document.getElementById("login-btn");
  if (spotifyLoginBtn) {
    spotifyLoginBtn.addEventListener("click", function () {
      // Open your custom login page
      window.location.href = "./Login.html";
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const username = params.get("username");
  const loginBtn = document.getElementById("login-btn");
  const logo = document.querySelector(".logo");

  // Remove any previous user span or logout
  let userSpan = document.getElementById("user-span");
  let logoutBtn = document.getElementById("logout-btn");
  if (userSpan) userSpan.remove();
  if (logoutBtn) logoutBtn.remove();

  if (username) {
    // Hide login button
    if (loginBtn) loginBtn.style.display = "none";

    // Show username
    if (logo) {
      userSpan = document.createElement("span");
      userSpan.id = "user-span";
      userSpan.textContent = " | Welcome, " + username;
      userSpan.style.fontSize = "25px";
      userSpan.style.color = "#fff";
      userSpan.style.fontFamily = "Arial, sans-serif";
      userSpan.style.fontWeight = "bold";
      userSpan.style.marginLeft = "10px";
      userSpan.style.cursor = "pointer";
      userSpan.style.background = "linear-gradient(45deg, #7877c6, #78dbff, #ff77c6, #c677ff)";
      userSpan.style.backgroundSize = "300% 300%";
      userSpan.style.backgroundClip = "text";
      userSpan.style.webkitTextFillColor = "transparent";
      userSpan.style.animation = "gradient 4s ease-in-out infinite";
      userSpan.style.textShadow = "0 0 30px rgba(120, 119, 198, 0.5)";
      logo.appendChild(userSpan);

      // Add logout button (hidden by default)
      logoutBtn = document.createElement("button");
      logoutBtn.id = "logout-btn";
      logoutBtn.textContent = "Log out";
      logoutBtn.style.display = "none";
      logoutBtn.style.marginLeft = "10px";
      logoutBtn.style.padding = "5px 10px";
      logoutBtn.style.backgroundColor = "transparent"; // Red background
      logoutBtn.style.color = "#c677ff"; // White text
      logoutBtn.style.border = "1px solid #c677ff"; // White border
      logoutBtn.style.borderRadius = "5px";
      logoutBtn.style.cursor = "pointer";
      logoutBtn.style.fontSize = "16px";
      logoutBtn.style.fontFamily = "Arial, sans-serif";
      logo.appendChild(logoutBtn);

      // Show logout on username click
      userSpan.addEventListener("click", function () {
        logoutBtn.style.display = logoutBtn.style.display === "none" ? "inline-block" : "none";
      });

      // Handle logout
      logoutBtn.addEventListener("click", function () {
        // Remove username from URL and reload
        window.location.href = window.location.pathname;
      });
    }
  } else {
    // Show login button
    if (loginBtn) loginBtn.style.display = "inline-block";
    // Remove user span and logout if present
    if (userSpan) userSpan.remove();
    if (logoutBtn) logoutBtn.remove();
  }
});

function setupPlaylistButton() {
  const playlistBtn = document.querySelector(".animated-button");
  if (playlistBtn) {
    playlistBtn.addEventListener("click", async function () {
      // Fetch more tracks with a different query or offset for more music cards
      const response = await getPopularTrack("top hits"); // You can change the query as needed
      if (response && response.tracks && response.tracks.items) {
        displayTrack(response.tracks.items);
      } else {
        alert("No more music found!");
      }
    });
  }
}

// ...existing code...

function setupSearchListeners() {
  const inputSearch = document.getElementById("input-search");
  inputSearch.addEventListener("input", (e) => {
    const querry = e.target.value.trim();
    clearTimeout(searchTimeout); // Clear the previous timeout
    //debounce
    const searchTimeout = setTimeout(async () => {
      if (querry) {
        const response = await getPopularTrack(querry);
        resetTrack();
        displayTrack(response.tracks.items);
      }
    }, 2500);
  });
}

function resetTrack() {
  const trackSection = document.getElementById("track-section");
  trackSection.innerHTML = ""; // Clear the track section
}

async function initialApp() {
  token = await getSpotifyToken();
  if (token) {
    const data = await getPopularTrack(); // Await and get the data
    if (data && data.tracks && data.tracks.items) {
      displayTrack(data.tracks.items);
    } else {
      console.log("No tracks found.");
    }
  }
}

function displayTrack(data) {
  console.log(data);
  data.forEach((item) => {
    // console.log(item);
    console.log(item.id);
    const imageUrl = item.album.images[0].url;
    const name = item.name;
    const artistName = item.artists.map((item) => item.name).join("- ");
    console.log(imageUrl, name, artistName);
    // Add click event to play track
    // create div
    const element = document.createElement("div");
    // add class for div
    element.className = "track-card";
    // add document to div
    element.innerHTML = `
    <div class="track-card-container">
       <img src="${imageUrl}" alt="">
       <h3>${truncateText(name, 20)}</h3>
        <p>${truncateText(artistName, 10)}</p>
    </div> `;
    // add div into track-section
    const trackSection = document.getElementById("track-section");
    trackSection.appendChild(element);
    element.addEventListener("click", () => {
      playTrack(item.id, name, artistName);
    });
  });
}
function playTrack(id, name, artistName) {
  //  console.log(`Playing track: ${name} by ${artistName} with ID: ${id}`);
  // Here you can implement the logic to play the track using Spotify's Web Playback SDK or any other method
  const iframe = document.getElementById("iframe");
  iframe.src = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
  const modalName = document.getElementById("modal-name");
  modalName.innerHTML = name;
  const modal = document.getElementById("modal");
  modal.style.display = "block";
  const modalArtist = document.getElementById("modal-artist");
  modalArtist.innerHTML = artistName;
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
  const iframe = document.getElementById("iframe");
  iframe.src = ""; // Clear the iframe source to stop playback
}

function truncateText(text, number) {
  return text.length > number ? text.slice(0, number) + "..." : text;
  //  text.length > 10 ? (dieu kien dung) text.slice(0, 5) + (dieu kien sai) "..." : text;
}
async function getPopularTrack(querry = "Son Tung-MTP") {
  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: querry, // Search query
        type: "track",
        limit: 12, // Limit the number of results
      },
    });

    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

async function getSpotifyToken() {
  try {
    const credentials = btoa(
      `${SPOTIFY_CONFIG.CLIENT_ID}:${SPOTIFY_CONFIG.CLIENT_SECRET}`
    );

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// document.addEventListener("DOMContentLoaded", function () {
//   const params = new URLSearchParams(window.location.search);
//   const username = params.get("username");
//   const loginBtn = document.getElementById("login-btn");
//   const logo = document.querySelector(".logo");

//   let userSpan = document.getElementById("user-span");
//   let logoutBtn = document.getElementById("logout-btn");
//   if (userSpan) userSpan.remove();
//   if (logoutBtn) logoutBtn.remove();

//   if (username) {
//     if (loginBtn) loginBtn.style.display = "none";
//     if (logo) {
//       userSpan = document.createElement("span");
//       userSpan.id = "user-span";
//       userSpan.textContent = " | Welcome, " + username;
//       userSpan.style.fontSize = "1rem";
//       userSpan.style.marginLeft = "10px";
//       userSpan.style.cursor = "pointer";
//       logo.appendChild(userSpan);

//       logoutBtn = document.createElement("button");
//       logoutBtn.id = "logout-btn";
//       logoutBtn.textContent = "Log out";
//       logoutBtn.style.display = "none";
//       logoutBtn.style.marginLeft = "10px";
//       logo.appendChild(logoutBtn);

//       userSpan.addEventListener("click", function () {
//         logoutBtn.style.display = logoutBtn.style.display === "none" ? "inline-block" : "none";
//       });

//       logoutBtn.addEventListener("click", function () {
//         window.location.href = window.location.pathname;
//       });
//     }
//   } else {
//     if (loginBtn) loginBtn.style.display = "inline-block";
//     if (userSpan) userSpan.remove();
//     if (logoutBtn) logoutBtn.remove();
//   }
// });

