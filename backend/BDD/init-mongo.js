db = db.getSiblingDB('playmarket');

const gameDetailsData = [
  {
    gameId: 1,
    description: "Explorez un monde ouvert immense avec une liberté totale. Escaladez, planez et découvrez les secrets d'Hyrule.",
    tags: ["Action", "Aventure", "Open World", "Nintendo", "Exploration"],
    videos: [
      { title: "Trailer", url: "https://www.youtube.com/watch?v=zw47_q9wbBE" }
    ]
  },
  {
    gameId: 2,
    description: "Vivez l'épopée d'Arthur Morgan dans l'Amérique sauvage de 1899. Un western épique avec un monde vivant et réaliste.",
    tags: ["Action", "Aventure", "Western", "Rockstar", "Open World"],
    videos: [
      { title: "Trailer officiel", url: "https://www.youtube.com/watch?v=eaW0tYpxyp0" }
    ]
  },
  {
    gameId: 3,
    description: "Plongez dans Night City et devenez une légende urbaine. RPG futuriste avec choix narratifs et action intense.",
    tags: ["RPG", "Cyberpunk", "FPS", "CD Projekt Red", "Sci-Fi"],
    videos: [
      { title: "Gameplay", url: "https://www.youtube.com/watch?v=8X2kIfS6fb8" }
    ]
  },
  {
    gameId: 4,
    description: "Explorez les Terres Intermédiaires dans ce RPG sombre et exigeant. Un univers fantasy créé par Miyazaki et Martin.",
    tags: ["RPG", "Souls-like", "Dark Fantasy", "FromSoftware", "Difficile"],
    videos: [
      { title: "Trailer de lancement", url: "https://www.youtube.com/watch?v=K_03kFqWfqs" }
    ]
  },
  {
    gameId: 5,
    description: "Kratos et Atreus affrontent les dieux nordiques. Une aventure père-fils épique mêlant action brutale et émotion.",
    tags: ["Action", "Aventure", "Mythologie", "PlayStation", "Hack and Slash"],
    videos: [
      { title: "Trailer", url: "https://www.youtube.com/watch?v=K0u_kAWLJOA" }
    ]
  },
  {
    gameId: 6,
    description: "Construisez, explorez et survivez dans un monde infini de blocs. Votre créativité est la seule limite.",
    tags: ["Sandbox", "Survie", "Construction", "Mojang", "Multijoueur"],
    videos: []
  },
  {
    gameId: 7,
    description: "L'expérience open world ultime à Los Santos. Braquages, courses et chaos dans une ville vivante.",
    tags: ["Action", "Open World", "Crime", "Rockstar", "Multijoueur"],
    videos: []
  },
  {
    gameId: 8,
    description: "Incarnez Geralt de Riv dans ce RPG fantastique primé. Chassez des monstres et vivez une histoire captivante.",
    tags: ["RPG", "Fantasy", "Open World", "CD Projekt Red", "Mature"],
    videos: []
  },
  {
    gameId: 9,
    description: "Starter pack pour le FPS tactique 5v5 de Riot. Agents, skins exclusifs et compétition intense au rendez-vous.",
    tags: ["FPS", "Tactique", "Compétitif", "Riot Games", "Esport"],
    videos: []
  },
  {
    gameId: 10,
    description: "Carte RP pour League of Legends. Débloquez champions et skins dans le MOBA le plus populaire au monde.",
    tags: ["MOBA", "Stratégie", "Compétitif", "Riot Games", "Esport"],
    videos: []
  }
];

db.gameDetails.deleteMany({});
db.gameDetails.insertMany(gameDetailsData);

print('✅ Game details initialisés dans MongoDB');
