# Realtime Elo Ranker Server

Ce projet est un serveur NestJS pour gérer les matchs et le classement Elo des joueurs en temps réel.

## Auteur
Khalil ABADA

## Prérequis

- Node.js (version 14 ou supérieure)
- pnpm (gestionnaire de paquets)

## Installation

Clonez le dépôt et installez les dépendances :

```bash
git clone https://github.com/khalil-45/realtime-elo-ranker-master.git
cd realtime-elo-ranker-master
pnpm install
```

## Lancer le serveur

Pour lancer le serveur NestJS, exécutez la commande suivante :

```bash
pnpm run start:server
```

Le serveur sera accessible à l'adresse [http://localhost:3001](http://localhost:3001).

## Lancer le client

Une fois le serveur lancé, vous pouvez lancer le client Next.js. Exécutez la commande suivante dans un autre terminal :

```bash
pnpm run start:client
```

Le client sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## Commandes utiles

### Serveur

- `pnpm run start:server` : Lance le serveur NestJS en mode développement.
- `pnpm run build:server` : Compile le serveur NestJS pour la production.
- `pnpm run start:server:prod` : Lance le serveur NestJS en mode production.

### Client

- `pnpm run start:client` : Lance le client Next.js en mode développement.
- `pnpm run build:client` : Compile le client Next.js pour la production.
- `pnpm run start:client:prod` : Lance le client Next.js en mode production.

### Tests

- `pnpm run test` : Exécute les tests unitaires.
- `pnpm run test:e2e` : Exécute les tests end-to-end.
- `pnpm run test:coverage` : Génère un rapport de couverture de tests.

## Structure du projet

- `realtime-elo-ranker-server` : Contient le code source du serveur NestJS.
- `realtime-elo-ranker-client` : Contient le code source du client Next.js.
