# Le Chat de Schrödinger

Il s'agit d'une mini-application web de chat temps-réel.
Choisissez un nom d'utilisateur ou contentez-vous de celui qui vous est aléatoirement attribué, et c'est aussi simple que de taper au clavier.

## Installation

Pré-requis : Node.js - https://nodejs.org/fr/  
Optionnel : Yarn - https://yarnpkg.com/fr/

```
git clone --recurse-submodules https://github.com/LanscelThaledric/schrodinger-chat.git

cd schrodinger-chat

yarn install
 - or -
npm install

yarn start
 - or -
npm start
```

L'application devrait être hébergée à http://localhost:3000/.
Ouvrez plusieurs onglets à cette adresse pour échanger entre plusieurs personnes.

## Choix techniques

L'application utilise l'API native des web components pour gérer l'interface client, ainsi qu'un serveur Node.js.
Après avoir fait quelques recherches sur la mise en place de websockets, j'ai finalement opté pour utiliser Express (http://expressjs.com/fr/), disposant d'une API pratique et peu verbeuse, couplé à Socket.io (https://socket.io/) qui jouit des mêmes qualités.
Pour ce qui est du côté front, bien qu'ayant déjà utilisé React par le passé, l'API des web components était encore pour moi quelque chose d'inconnu. J'ai alors préféré ne pas utiliser de framework pour cet exercice et en apprendre plus sur la norme et sur l'API native.
Il s'agit d'une API moderne fonctionnant avec la norme ES2015 qui ne fonctionnera pas sur d'anciens navigateurs. Cependant j'ai considéré que la rétro-compatibilité ne serait pas très importante pour cet exercice, et qu'il suffirait pour pallier à ce problème d'utiliser Babel, ainsi que décommenter la ligne 9 de `client/index.html` afin d'élargir le champ de navigateurs compatibles. J'ai préféré me concentrer sur l'implémentation des différentes fonctionalités.

Chaque onglet ouvert sur l'application correspond à un utilisateur différent.
Après avoir implémenté un premier prototype permettant au serveur de faire circuler les messages sans aucune sauvegarde, j'ai souhaité permettre de se donner un nom. Lors de la connexion le serveur nous en attribue un au hasard, mais il est possible de changer notre nom à notre guise. Le serveur doit donc sauvegarder des données (noms des utilisateurs connectés et messages passés) afin de les remettre à un utilisateur rejoignant le chat. Ces données sont conservées dans des variables locales au serveur Node, et toutes les informations seront perdues si le processus est arrêté. Il s'agit là de garder une architecture de petite taille et un chat qui soit volatile.
Afin de conserver ces données après un arrêt du serveur, on peut imaginer les stocker dans une base de données locale qui sera rechargée en totalité, ou en partie afin de restituer les anciens messages.

Concernant le front-end, l'application me semblait de taille suffisemment petite pour ne pas nécessiter l'utilisation de bundler tel que Webpack, j'ai donc créé deux fichiers html, un contenant de quoi charger l'application et gérant la compatibilité des web components, et un autre contenant l'application elle-même. L'outil webcomponentsjs sera alors intégré comme sous-module de git plutôt que via le registre npm.

L'application est alors divisée en quatre components, `LcsApp` étant l'élément principal et parent de tout les autres : `LcsInput` (le champ de texte qui est validé lors de l'appui sur la touche Entrée), `LcsMessages` affichant une liste des messages d'une conversation, et `LcsUsers`, permettant d'afficher une liste d'utilisateurs ainsi que de changer notre nom.

Voilà qui termine cerésumé des choix techniques faits pour cet exercice.