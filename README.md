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
"After confirming the action, the user should be displayed on the main list with OFFBOARDED state without site reloading" - I assume you also mean without fetching list or single employee from backend, and frontend has to properly manage changes on its own, simulating working 'offline'.
I assumed I shouldnt use any additional libraries.
I decided to write this app as if I was future-proofing any real project. It may be overly complex for this simple scope, but limiting myself here would not allow me to showing anything interesting.
In this readme I may use word "module" - i mean it as domain/subproject, not angular ngmodule.

I left few notes around. please, look for comments with 'bg-info' - they give some additional insight.

### tests
I created tests only for selected files. These will give some sense how I write them. Covering everything would be just too time consuming. However, if you wish to see more, I will add them.
I use Jest on daily basis, so if something is suboptimal, I may just not know most fitting API in Jasmine.

I used data-selector approach in few places - It has prouseful way to mark elements of interest, but not be tied to specific tag name or structure. in case component changes or is replaced with new version that follows same flow, old test (mostly e2e) could potentially still be run.

### styling & additional features
I created stub of css utility classes. I'm fond of this approach. With decent library of classes, many components no longer need their own scss files, and looks are coherent.

I tried to make the app as real as reasonably possible. I added few additional elements here and there (loaders, progress bar, etc).
I tried to recreate your styling. few nuances:
- @material/web/elevation
-- elevation made as a component is strange design - overflow:hidden will hide the shadow as well.
-- to work around this issues I copied scss from package and adjusted it:
--- removed division into before and after - it was to use different opacity of shadow. I replaced it with css relative colors applying specified opacities. 
additionally i added drop-shadow, to make it work with clip-path. lacking spread param its close, but not 1:1.
For my shadows, I followed materials css variable schema, but I changed prefix from ***md*** to ***tqpas***
For employees list I used table. however, for rows I used anchor with display table-row. this allows to open details in new window effortlesly. I would use grid layout now for better styling. 

### InjectionTokens 
I utilise InjectionTokens in my code. By using them code is more scalable. Used in DI, they allow for easy swap of implementation implementation in various cases (switching between web and mobile, versioning, feature flags, flows dependend on context). This makes code more decoupled, scalable and reusable.
For example, in current scope, offboarding user with **offboarding-form-modal** causes parent list to be updated. This component is a good candidate for being widget, but not every flow may require updating parent list. By providing various implementations via **offboard-employee.token**, I can modify flow  for specific contexts. When using **offboarding-form-modal** in another place without parent list, I will have to create only new service .

### services & their responsibilites
I separate logic into . Examples in this project: 
- storage - set and keep data
- API - communicate with backend
- list - orchestrating service to process list (eg. load items, apply filtering). 
This has proven to create services that are easy to maintain, test, mock and to act as building blocks for more complex flows.
services like 'offboarding-list', 'offboarding-details' could be called 'view service' - they provide logic for components.

### scoped services
I use component scoped services. They have many advantages:
- short lived - they exist only when needed. will not waste memory and processor ticks.
- easy to maintain - DI lifecycle takes care of initalization and disposing. No need to refresh state when entering some flow again.
- cohesive - they can be put close to related parts of app, which translates into being easy to discover and understand. lowers cognitive load
- precise models - models can be small, exactly fitting functionality of feature, without worry that they need to supply several flows
- access control - it is easier to control what uses them.
How scoped services fit in this example:
- if there ever is another module than 'offboarding' (for example, device mana), navigating to it 
- details view could be made to work completely independently from list view very easily
- when leaving details view, all its services will be destroyed, freeing memory
- details view could easily use more detailed model, and list only minimal

I'm adding "v2" - implementation, where everything is based on central employees list storage. it makes code a bit simpler, but lowers independence of details component (). GET single employee endpoint is useless in this approach. To see how it works, please write in address bar '/offboarding-v2' - this will lead to the main list equivalent.

### app & libraries:
App is divided in packages and tsconfig paths are used to reference their contents
Advantages:
- app serves only as runtime config - routing, environment. logic and components come from
- libraries - contain components, reusable code, business flows
- in case packages are made to be distributed via package manager, code already uses correct syntax
- easy to remove features
- promotes division into chunks
- better team work - lower chance of merge conflics when teams work on their designated packages. possibility for clean codeowners rules

### project structure
I followed vertical slice architecture for offboarding module. It creates mostly self-contained, highly cohesive features. It makes easier to discover and understand dependencies within feature.
In case of more complex module with lots of reusable, division into package-per-layer may be beneficial - for example, @tqpas/offboarding/infrsatructure, to provide API calls for other modules

#### final notes
many of my decisions here come up from past experiences. without project context, planned development and envisioned future features, this is what I default to. everything may change depending on actual scale and requirements. 