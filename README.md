
# tqpas
## Instructions
(optional) run `npm run gen-employees` to generate 10 employees to use in the web server.
Alternatively, run `node ./mock-server/generator.js X` where X stands for the amount of employees to generate.

run `npm run start-server` to start mocked server.
run `npm run start` to start Angular app.



## Assumptions, reasoning and hints

### Assignment understanding
The assignment mentions "Google Material Design Components." With vague wording like that, I assumed I am not to use Angular Material, but https://github.com/material-components/material-web - web components.

~~I assumed I shouldn't use any additional external packages (like store or test mocks libs).~~ 
Initially, I didn't use external libraries, but having more time, I decided to add NGRX component store for comparison to vanilla approach. More below - look for v3.

For validators, I used only the simplest ones. Phone number and postal code are extremely different across the globe, and without further details, there is no valid choice.

"After confirming the action, the user should be displayed on the main list with OFFBOARDED state without site reloading" - I assume you also mean without fetching list or single employee from backend, and frontend has to properly manage changes on its own, simulating working 'offline'.

I decided to write this app as if I was future-proofing any real project. It may be overly complex for this simple scope, but limiting myself here would not allow me to show anything interesting. 
There is room for more good practices of web development - among the others: feature flags, logging, analytics - but I tried to not get carried away.

In this README, I may use the word "module" - I mean it as domain/subproject, not Angular ngModule.

I left a few notes around. Please, look for comments with 'bg-info' - they give some additional insight.

Nomenclature - **Storage** - service that holds state and provides it in reactive manner via RXJS observable. THIS IS NOT RELATED TO LOCAL OR SESSION STORAGE.
I used this naming to show distinction from "store" that usually is meant as Redux store, with its built in pub/sub, actions and so on.

### tests
I created tests only for selected files. These will give some sense to how I write them. Covering everything would be just too time-consuming. However, if you wish to see more, I will add them.
I use Jest on a daily basis, so if something is suboptimal, I may just not know the most fitting API in Jasmine.

I used data-selector approach in a few places. It is an easy way to mark elements of interest without being tied to a specific tag name or structure. In case a component changes or is replaced with a new version that follows the same flow, an old test (mostly e2e) could potentially still be run.

### styling & additional features
I created a stub of CSS utility classes. I'm fond of this approach. With a decent library of classes, many components no longer need their own SCSS files, and visuals are coherent.

I tried to make the app as real as reasonably possible. I added a few additional elements here and there (loaders, progress bar, etc.).

I tried to recreate your styling. Few nuances:
- @material/web/elevation
-- elevation made as a component is strange design - overflow:hidden will hide the shadow as well.
-- to work around these issues, I copied SCSS from the package and adjusted it:
--- removed division into before and after - it was to use different opacity of shadow. I replaced it with CSS relative colors applying specified opacities. 
Additionally, I added drop-shadow, to make it work with clip-path. Lacking the spread parameter, it's close, but not 1:1.
For my shadows, I followed materials CSS variable schema, but I changed prefix from ***md*** to ***tqpas***
For the employee list, I used a table. However, for rows, I used anchor with display table-row. This allows to open details in a new window effortlessly. I would use grid layout now for better styling. 

### InjectionTokens 
I utilize InjectionTokens in my code. By using them, code is more scalable. Used in DI, they allow for easy swap of implementation in various cases (switching between web and mobile, versioning, feature flags, flows depending on context). This makes code more decoupled, scalable and reusable.
For example, in the current scope, offboarding an employee with **offboarding-form-modal** causes the parent list to be updated. This component is a good candidate for being a widget, but not every flow may require updating the parent list. By providing various implementations via **offboard-employee.token**, I can modify flow for specific contexts. When using **offboarding-form-modal** in another place without a parent list, I will have to create only a new service.

### Services and their responsibilities
I separate logic into services by their responsibilities. Examples in this project: 
- storage - set and keep data
- API - communicate with backend
- list, details, and offboarding services - these are facades that orchestrate other services (storage, API) to run some flow (e.g., load items, apply filtering, create offboarding and apply status). 
This separation creates services that are easy to maintain, test, and mock and to act as building blocks for more complex flows.
Services like 'offboarding-list' and 'offboarding-details' could be called 'view services' - they provide logic for components.

### scoped services
I use component-scoped services. They have many advantages:
- short-lived - they exist only when needed. Will not waste memory and processor ticks.
- easy to maintain - DI lifecycle takes care of initialization and disposal. No need to refresh state when entering some flow again.
- cohesive - they can be put close to related parts of the app, which translates into being easy to discover and understand. Lowers cognitive load
- precise models - models can be small, exactly fitting functionality of feature, without worry that they need to supply several flows
- access control - it is easier to control what uses them
How scoped services fit in this example:
- details view could be made to work completely independently of list view, very easily
- when leaving details view, all its services will be destroyed, freeing memory
- details view could easily use a more detailed model, and list only minimal model

#### v2, v3, v4
Additional implementations of state management. They are meant to highlight various approaches.
"v2" - implementation, where everything is based on central employees list storage. It makes code a bit simpler but makes the details component directly dependent on it. GET single employee endpoint is useless in this approach. 
"v3" - similar to above, but based on ngrx component store. I tried to avoid one massive store file, so some logic remains in subservices, like offboarding service.
"v4" - as a last touch, I also added global ngrx store. I was speeding to deliver this one, so it may be a bit less polished.

To access any of these versions, please navigate to '/offboarding-v2', '/offboarding-v3' or '/offboarding-v4'


### app & libraries:
The app is divided into packages, and tsconfig paths are used to reference their contents.
Advantages:
- app serves only as runtime config: routing, environment variables. Logic and components come from libraries.
- libraries - contain components, reusable code, and business flows.
- in case packages are made to be distributed via package manager, code already uses correct syntax
- easy to remove features
- promotes division into chunks
- better teamwork and collaboration - lower chance of merge conflicts when teams work on their designated packages. Possibility for clean codeowners rules.
Since components in the offboarding package are standalone, they are already being built into separate chunks. Further dividing into subpackages would only increase complexity without merit. 

### project structure
I followed vertical slice architecture for the offboarding module. It creates mostly self-contained, highly cohesive features. It makes it easier to discover and understand dependencies within features.
In a case of more complex modules with lots of reusable, division into package-per-layer may be beneficial - for example, @tqpas/offboarding/infrastructure - to provide API calls for other modules.

#### final notes
Many of my decisions here come up from experiences. Without project context, planned development, and envisioned future features, this is what I default to. Everything may change depending on the actual scale and requirements. 
