const plzInput = document.getElementById("plz");
const cityInput = document.getElementById("city");
const citySelect = document.getElementById("city-select");

let results = [];

plzInput.addEventListener("input", async () => {
  const plz = plzInput.value.trim();

  citySelect.innerHTML = "";
  citySelect.style.display = "none";

  if (plz.length < 2) return;

  try {
    const res = await fetch(
      `https://openplzapi.org/ch/Localities?postalCode=${encodeURIComponent(plz)}`
    );

    const data = await res.json();

    console.log("API DATA:", data);

    if (!Array.isArray(data) || data.length === 0) {
      cityInput.value = "";
      return;
    }

    results = data;

    citySelect.style.display = "block";

    data.forEach((item, i) => {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = `${item.name} (${item.postalCode})`;
      citySelect.appendChild(option);
    });

    cityInput.value = data[0].name;

  } catch (err) {
    console.error(err);
  }
});

citySelect.addEventListener("change", () => {
  const selected = results[Number(citySelect.value)];

  console.log("SELECTED:", selected);

  if (!selected) return;

  cityInput.value = selected.name;
  plzInput.value = selected.postalCode; // 🔥 WICHTIG: camelCase
});

cityInput.addEventListener("blur", async () => {
  const city = cityInput.value.trim();

  if (!city) return;

  try {
    const res = await fetch(
      `https://openplzapi.org/ch/Localities?name=${encodeURIComponent(city)}`
    );

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) return;

    plzInput.value = data[0].postalCode;
  } catch (err) {
    console.error(err);
  }
});