import './style.scss';

let timeout;

// Event sauber registrieren (nur einmal!)
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("plz")
    .addEventListener("input", sucheOrt);
});

async function sucheOrt() {
  clearTimeout(timeout);

  timeout = setTimeout(async () => {
    const plz = document.getElementById("plz").value;
    const ortSelect = document.getElementById("ort");

    ortSelect.innerHTML = "";

    if (plz.length < 4) return;

    try {
      const response = await fetch(
        "https://openplzapi.org/ch/Localities?postalCode=" + plz
      );
      const data = await response.json();

      if (data.length === 0) {
        const option = document.createElement("option");
        option.textContent = "nicht gefunden";
        ortSelect.appendChild(option);
        return;
      }

      data.forEach((eintrag) => {
        const option = document.createElement("option");
        option.value = eintrag.name;
        option.textContent = `${eintrag.name} (${eintrag.canton.shortName})`;
        ortSelect.appendChild(option);
      });

    } catch (error) {
      const option = document.createElement("option");
      option.textContent = "Fehler";
      ortSelect.appendChild(option);
    }
  }, 300);
}
