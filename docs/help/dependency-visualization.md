## Dependency Visualization  
### Purpose  
The Dependency Visualization feature serves as way to view implicit (e.g. blocking or cloning) and explicit (e.g. assigned developers) relationships between certain issues at a glance.     

### Getting Started  
{pictures, starting steps}
 
#### Ways to interact with the graphs  
- Zoom: using mousewheel, touchpad, or the zoom buttons in the bottom left corner, you can zoom in and out.
- Pan: click and drag to move around the graph. Clicking on an issue node will move that node instead of the graph view.
- Click: clicking on an issue node will bring up that issue's information page in a new browser tab.

### Troubleshooting  
Due to certain limitations of Jira, this feature will work optimally in situations where the text processing features of the tool have already been used, so that blocking relationships are made clear in ways that can be extracted with API queries. For this reason, some Epic graphs may not be what you'd expect, e.g. showing only the current issue but no children that are under them. To remedy this, you can add the relationships from Jira's `Link issues` button from the issue panel, then hide and reopen the Dependency Visualization panel once you're done, from the upper righthandside options menu (hide) and then the button used to open the panel in the first place.
