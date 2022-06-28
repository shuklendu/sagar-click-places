const loadPlaces = function (coords) {
  // COMMENT FOLLOWING LINE IF YOU WANT TO USE STATIC DATA AND ADD COORDINATES IN THE FOLLOWING 'PLACES' ARRAY
  const method = "api";

  const PLACES = [
    {
      name: "Pimpleshwar Point",
      location: {
        lat: 19.18714,
        lng: 73.09182
      },
    },
    {
      name: "Swad Dhaba",
      location: {
        lat: 19.18705,
        lng: 73.09194
      },
    },
  ];

  return Promise.resolve(PLACES);
};

window.onload = () => {
  const scene = document.querySelector("a-scene");

  // first get current user location
  return navigator.geolocation.getCurrentPosition(
    function (position) {
      // then use it to load from remote APIs some places nearby
      loadPlaces(position.coords).then((places) => {
        places.forEach((place) => {
          const latitude = place.location.lat;
          const longitude = place.location.lng;

          // add place icon
          const icon = document.createElement("a-image");
          icon.setAttribute(
            "gps-entity-place",
            `latitude: ${latitude}; longitude: ${longitude}`
          );
          icon.setAttribute("name", place.name);
          icon.setAttribute("src", "https://raw.githubusercontent.com/shuklendu/sagar-click-places/main/assets/map-marker.png");

          // for debug purposes, just show in a bigger scale, otherwise I have to personally go on places...
          icon.setAttribute("scale", "20, 20");

          icon.addEventListener("loaded", () =>
            window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"))
          );

          const clickListener = function (ev) {
            console.log(ev);
            ev.stopPropagation();
            ev.preventDefault();
            alert("hello");
            const name = ev.target.getAttribute("name");

            const el =
              ev.detail.intersection && ev.detail.intersection.object.el;

            if (el && el === ev.target) {
              const label = document.createElement("span");
              const container = document.createElement("div");
              container.setAttribute("id", "place-label");
              label.innerText = name;
              container.appendChild(label);
              document.body.appendChild(container);

              setTimeout(() => {
                container.parentElement.removeChild(container);
              }, 150000);
            }
          };

          icon.addEventListener("click", clickListener);

          scene.appendChild(icon);
        });
      });
    },
    (err) => console.error("Error in retrieving position", err),
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 27000,
    }
  );
};
