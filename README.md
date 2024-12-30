# tqpas
## Instructions
(otpional) run `npm run gen-employees` to generate 10 employees to use in web server.
alternatively, run `node ./mock-server/generator.js X` where X stands for amound of employees to generate

run `npm run start-server` to start mocked server.
run `npm run start` to start angular app.



## assumptions, reasoning and hints

### assignement understanding
Assignement mentions "Google Material Design components". With vague wording like that, I assumed I am not to use Angular Material, but https://github.com/material-components/material-web - web components.
For validators I used only the simplest ones. phone number and postal code are extremely different across the globe, and without further details, there is no valid choice.
"After confirming the action, the user should be displayed on the main list with OFFBOARDED state without site reloading" - I assume you also mean without fetching list or single employee from backend, and frontend has to properly manage changes on its own.
I assumed I shouldnt use any additional libraries.
I decided to write this app as if I was future-proofing any real project. It may be overly complex for this simple scope, but limiting myself here would not allow me to showing anything interesting.

I left few notes around. please, look for comments with 'bg-info' - they give some additional insight.

### tests
I created tests only for selected files, more complex ones. These will give some sense how I write them. Covering everything would be just too time consuming. However, if you wish to see more, I will add them.
I use Jest on daily basis, so if something is suboptimal, I may just not know best API in Jasmine.

I used data-selector approach in few places - useful way to mark elements of interest, but not be tied to specific tag name or structure. in case component changes or is replaced with new version that follows same flow, old test (mostly e2e) could potentially still be run.

### styling & additional features
I created stub of css utility classes. I'm fond of this approach. With decent library of classes, many components no longer need their own scss files, and looks are cohesive.

I tried to make the app as real as reasonably possible. I added few additional elements here and there (loaders, progress bar, etc).
I tried to recreate your styling. few nuances:
- @material/web/elevation
-- elevation made as a component is strange design - overflow:hidden will hide the shadow as well.
-- to work around this issues I copied scss from package and adjusted it:
--- removed division into before and after - it was to use different opacity of shadow. I replaced it with css relative colors applying specified opacities. additionally i added drop-shadow, to make it work with clip-path. lacking spread param its close, but not 1:1. I changed css variables from md to tqpas
For employees list I used table. however, for rows I used anchor with display table-row. this allows to open details in new window effortlesly. I would use grid layout now for better styling. 

### InjectionTokens 
I rely on them for DI providers that I suspect may change in future or be used in multiple places. For example **offboard-employee.token** -> it is used by **offboarding-form-modal**, meant to orchestrate sending post request, updating status in employee list and details. but this component is a nice candidate to be a widget - self contained component to be added elsewere. by changing implementation behind **offboard-employee.token** (remove updating list and detail models) it can be used elsewere.

### services & their responsibilites
I try to divide services by their responsibilities:
- storage - set and keep data
- API - communicate with backend
- list - process list (eg. apply filtering) . services like 'offboarding-list', 'offboarding-details' could be called 'view service' - they provide logic for components

### scoped services
I tend to use component-scoped services. they are easier to maintain and do not leak data. I'm used to apps with multiple "modules/domains", thats why I put employee list storage on scope page level. it is now common service for this "module". but if there was true requirement to have it globally (e.g. app does only this one thing or this is truly universal model and app supports working offline)
For employee list and details I decided create separate storages, instead of using list. There are 2 reasons for that:
- list tend to use less informations than detail pages. detail page will have to fetch the additional data. current implementation would make it easier to achieve that. otherwise someone may try to create model to fit both places, making it too big, carrying often not needed data.
-components are more independent - details component could be reused in some other part of app by exporting it as public - it will not require pulling entire employee list.

I'm adding "v2" - implementation, where everything is based on central employees list storage. it makes code a bit simpler, but lowers independence of details component. GET single employee endpoint is useless in this approach. To see how it works, please write in address bar '/offboarding-v2' - this will lead to the main list equivalent.

### app & libraries:
division into packages and use of tsconfig paths makes code prepared for division into packages served via package manager. it also promotes division into chunks.
app - with division into libraries, app serves as runtime config - routing, environment. all logic and componens come from libraries.
libraries - contain components, reusable code, business flows.

### project structure
I attempted to group features into vertical slices. This increases cohesion. App is too benefit from different structure.


#### final notes
many of my decisions here come up from past experiences. without project context, planned development and envisioned growth direction, this is what I default to. everything may change depending on actual scale and requirements. 