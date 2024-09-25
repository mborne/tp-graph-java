# tp-refactoring-graph

**ATTENTION** : Ce dépôt est une **archive correspondant à la version Java du TP**.

## Description

Projet de départ pour le [TP - Refactoring de traitement de graphe (version JAVA)](https://github.com/mborne/cours-patron-conception/blob/archive-java/src/annexe/tp-graph/index.md#tp---refactoring-de-traitement-de-graphe) associé au cours sur [les patrons de conception et principes de refactoring](https://mborne.github.io/cours-patron-conception/).

## Principes

* La branche par défaut ("initial") permet de récupérer un projet maven pour commencer à travailler
* Les branches 0.1, 0.2, etc. correspondront aux corrections pour chaque question du TP
* junit et mockito sont présents pour permettre l'écriture de tests unitaires

## Organisation du code

La classe [Application](src/main/java/org/acme/graph/Application.java) est le point d'entrée de l'application. La méthode `main` assure le démarrage de l'API implémentée à l'aide de [spring-boot](https://spring.io/guides/gs/spring-boot/).

Le code est organisé en package :

* `model` : Modélisation des données de l'application
* ̀`io` : Lecture de graphes
* `routing` : Implémentation de l'algorithme de calcul de plus court chemin
* `controllers` : Contrôleurs de l'application spring
* `config` : Configuration de l'application spring (initialisation des beans)
* `errors` : Gestion des erreurs (exceptions personnalisées)

## Utilisation

### Avec eclipse

* Lancer l'application "Application.java".
* Ouvrir http://localhost:8080/find-path?origin=1&destination=9557 dans un navigateur

### En ligne de commande

* Construire le jar : `mvn clean package`

```bash
mvn clean package
```

* Démarrer l'API : `mvn spring-boot:run`

* Tester l'API : `curl "http://localhost:8080/find-path?origin=1&destination=9557"`

## Données utilisées

Un extrait de [ROUTE500](https://files.opendatarchives.fr/professionnels.ign.fr/route500/) est présent dans `src/main/resources/route500/idf/troncon_route.shp` à des fins de tests. Il est intégré dans le jar et est chargé par défaut.

Il est possible de charger un autre fichier à l'aide de l'option `graph.path` :

```bash
java -Dgraph.path=path/to/troncon_route.shp -jar target/tp-refactoring-graph-0.1.0-SNAPSHOT.jar
```

## Notes

* Log en mode debug : `-Dlogging.level.org.acme.graph=DEBUG`.
* Génération de rapport de couverture : `mvn clean package jacoco:report` (voir target/site/jacoco/index.html)
* [VisualVM](https://visualvm.github.io/) pourra vous aider pour les optimisations.

## Licence

[MIT](LICENSE)
