# codeb.bloomberg

## Choix d'un algorithme de graphe
 - poids identiques ? -> DFS
 - construction d'un arbre ? -> DFS ou Dijkstra
 - chemin le plus court entre deux sommets et heuristique admissible ? -> A*

## Présentation des 3 implémentations

### DFS
 - algorithme de parcours de graphe en profondeur
 - arcs de poids identiques
 - peut construire un arbre

### A*
 - algorithme de parcours de graphe en profondeur
 - trouve un des chemins les plus courts d'une source à une destination
 - attention à à ce que l'heuristique est un sens. Si elle est correcte, A* trouve le chemin le plus court

### Dijkstra
 - algorithme de parcours de graphe en largeur
 - trouve le chemin le plus court à partir d'un sommet source
 - arc de poids positifs
 - peut construire un arbre
 - pour trouver le chemin le plus long à partir d'une source, prendre l'opposé des poids

### Bellman-Ford
À IMPLÉMENTER
 - trouve le chemin le plus court dans un graphe possédant des arcs de poids négatifs (détecter et s'arrête en cas de cycle absorbant)