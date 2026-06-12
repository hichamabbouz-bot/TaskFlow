# TaskFlow

Application MERN de gestion de taches avec authentification JWT, MongoDB, dashboard, liste/Kanban, filtres, rappels, notifications et theme clair/sombre.

## Technologies

- MongoDB Atlas
- Express.js / Node.js
- React
- Mongoose
- JWT
- Multer

## Installation

Depuis le dossier du projet :

```powershell
cd "C:\Users\Hicha\OneDrive\Bureau\TaskFlow"
```

Installer le backend :

```powershell
cd backend
npm install
```

Installer le frontend :

```powershell
cd ..\frontend
npm install
```

## Lancer le Projet

Ouvrir deux terminaux.

Terminal 1, backend :

```powershell
cd "C:\Users\Hicha\OneDrive\Bureau\TaskFlow\backend"
npm run dev
```

Terminal 2, frontend :

```powershell
cd "C:\Users\Hicha\OneDrive\Bureau\TaskFlow\frontend"
npm start
```

Ouvrir :

```txt
http://localhost:3000
```

API backend :

```txt
http://localhost:3001
```

Important : `npm run dev` se lance dans `backend`. Pour le frontend, utiliser `npm start`.

## Fonctionnalites

- Inscription et connexion
- Logout
- Upload photo de profil
- Ajout, modification et suppression de taches
- Recherche, filtres et tri
- Vue liste et vue Kanban
- Priorites, statuts, dates de livraison
- Rappels et notifications
- Dashboard et statistiques
- Projets et calendrier
- Theme clair/sombre

## Tests Rapides

Backend :

```powershell
cd backend
node -c server.js
node -c routes\tasks.js
node -c routes\auth.js
```

Frontend :

```powershell
cd frontend
npm run build
```

## Erreurs Courantes

Si `npm run dev` affiche `Could not read package.json`, vous n'etes pas dans le dossier `backend`.

Si `Cannot GET /api/auth/login` apparait dans le navigateur, c'est normal : le login utilise une requete `POST` via l'interface React.

Si l'interface affiche `Erreur serveur`, verifier que le backend est lance et que MongoDB Atlas accepte votre IP.
