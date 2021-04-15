## Dependency Visualization  
### Purpose  
The Dependency Visualization feature serves as way to view implicit (e.g. blocking or cloning) and explicit (e.g. assigned developers) relationships between certain issues at a glance.     

### Getting Started  
The Dependency Visualization feature includes two separate graphs. The Issue Tree will show any available parent, child, or otherwise blocking/blocked issues if they are listed in the linked issues or parent field in the Jira issue information. The Developer Cluster graph shows issues grouped in different clusters based on which developer they've been assigned to. Unassigned issues will be shown connected to an **N** node, to represent nobody has been assigned for those. Switching back and forth between the graphs is done via the button in the upper left corner of the graph, which will show either `View Developer Cluster` or `View Issue Tree` depending on which graph you are currently viewing.
 
#### Ways to interact with the graphs  
- Zoom: using mousewheel, touchpad, or the zoom buttons in the bottom left corner, you can zoom in and out.
- Pan: click and drag to move around the graph. Clicking on an issue node will move that node instead of the graph view.
- Click: clicking on an issue node will bring up that issue's information page in a new browser tab.

### Troubleshooting  
Due to certain limitations of Jira, this feature will work optimally in situations where the text processing features of the tool have already been used, so that blocking relationships are made clear in ways that can be extracted with API queries. For this reason, some Epic graphs may not be what you'd expect, e.g. showing only the current issue but no children that are under them. To remedy this, you can add the relationships from Jira's `Link issues` button from the issue panel, then hide and reopen the Dependency Visualization panel once you're done, from the upper righthandside options menu (hide) and then the button used to open the panel in the first place.
 
  
 
 [Return to Overview](https://aricmonary.github.io/AI4AgileJiraCloudApp/)
