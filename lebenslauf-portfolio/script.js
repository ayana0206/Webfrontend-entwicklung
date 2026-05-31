document.addEventListener("DOMContentLoaded", () => {
  const plzInput = document.getElementById("plz");
  const cityInput = document.getElementById("city");
  const contactForm = document.getElementById("contact-form");
  const feedbackDiv = document.getElementById("form-feedback");

  // --- AUTOCOMPLETION VIA OPENPLZAPI ---
  plzInput.addEventListener("input", async (e) => {
    const plz = e.target.value.trim();

    // Die API reagiert optimal bei 4 (CH) oder 5 (DE) Ziffern
    if (plz.length >= 4 && plz.length <= 5) {
      try {
        // Wir suchen primär nach Schweizer Orten (da gbs St. Gallen), 
        // du kannst die URL anpassen bei Bedarf (z.B. /de/ oder /ch/)
        const response = await fetch(`https://www.openplzapi.org/ch/localities?postalCode=${plz}`);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data && data.length > 0) {
            // Nimm den ersten gefundenen Eintrag und trage den Namen ein
            cityInput.value = data[0].name;
          } else {
            cityInput.value = "PLZ nicht gefunden";
          }
        }
      } catch (error) {
        console.error("Fehler beim Laden der API:", error);
        cityInput.value = "Fehler beim Laden";
      }
    } else {
      cityInput.value = ""; // Feld leeren, wenn die PLZ unvollständig ist
    }
  });

  // --- KONTAKTFORMULAR VALIDIERUNG & INTERAKTIVITÄT ---
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Verhindert das Neuladen der Seite

    // Input-Felder holen
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const city = cityInput.value.trim();

    // Feedback zurücksetzen
    feedbackDiv.className = "feedback-message";
    feedbackDiv.style.display = "none";

    // Validierung prüfen
    if (!name || !email || !message || !plzInput.value) {
      feedbackDiv.textContent = "Bitte füllen Sie alle Pflichtfelder (*) aus.";
      feedbackDiv.classList.add("error");
      return;
    }

    if (!validateEmail(email)) {
      feedbackDiv.textContent = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
      feedbackDiv.classList.add("error");
      return;
    }

    // Wenn alles passt: Erfolg melden!
    feedbackDiv.textContent = `Vielen Dank, ${name}! Deine Nachricht wurde erfolgreich simuliert gesendet. Wohnort: ${city || 'Unbekannt'}.`;
    feedbackDiv.classList.add("success");

    // Formular zurücksetzen
    contactForm.reset();
  });

  // Einfache Regex-Funktion zur E-Mail-Validierung
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});