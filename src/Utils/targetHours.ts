//----------------------------------------------------Vérif heures cible
const targetHours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]; // Heures cibles

// Fonction pour vérifier si l'heure est une heure cible
export function isTargetHour(date: string): boolean {
    const hour = new Date(date).getUTCHours();
    return targetHours.includes(hour);
}