# sync_project_deps

This is an array containing **package names** which are library or project dependencies. Moreover, the sequence of dependencies in this array is very important, on the basis of which the scripts are connected to index.html.
Since order is extremely important it is controlled automatically, rearguard looks for dependencies in two places:

1. Global node_modules.
2. Local node_modules.

After that, it recursively analyzes dependencies and finds out in which order the dependencies in the array should follow.
