# Bârtisan

Plateforme de mise en relation entre particuliers et artisans du bâtiment.

# Fonctionnalités principales

- **Authentification sécurisée** avec Laravel Sanctum.
- **Gestion multi-rôles** (Particulier, Artisan, Admin).
- **Basculation de profil** (Particulier → Artisan).
- **Gestion des compétences** et du rayon d’action pour les prestataires.

#  Technologie utlisée

- **Backend:** Laravel 12
- **PHP:** 8.4
- **Base de données:** MySQL

# Installation locale

 1. Cloner le projet

git clone [https://github.com/slamiath/baticonnect.git](https://github.com/slamiath/baticonnect.git)
cd baticonnect

2. Installation des dépendances avec la commande:

```bash
composer install
```
3. Configuration de l'environnement 

```bash
cp .env.example .env
php artisan key:generate
```

4. Configuration de la base de donnée 

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=baticonnect_db
DB_USERNAME=root
DB_PASSWORD=

5. Migration des tables dans la base de donnée 

php artisan migrate 

Remplit les données de test :

```bash

php artisan db:seed

```

> Les seeds créent notamment des comptes de test (voir `database/seeders/TestUsersSeeder.php`) :

> - admin: `admin@gmail.com` / `admin123`

> - client: `client@gmail.com` / `client123`

> - artisan: `artisan@gmail.com` / `artisan123`

6. Lancer le serveur 

```bash
php artisan serve
```

# Principaux Endpoints

-`POST /api/register` : Inscription.

-`POST /api/login` : Connexion (retourne le Token).

-`POST /api/switchToArtisan` : Passage au rôle Artisan
Certaines routes sont protégées par `auth:sanctum`.


# Gestion des profils
Lors du basculement vers le profil artisan l'utilisateur va devoir compléter les informations suivantes : 

**Métiers:** Liste de compétences techniques.
**Zone géographique:** Ville de résidence et périmètre d'intervention (en km).
**Bio:** Présentation textuelle des services proposés.
**Expérience:** Le nombre d'année de compétence.