# tqpas

Assignement mentions "Google Material Design components". With vague wording like that, I assumed I am not to use Angular Material, but https://github.com/material-components/material-web - web components.

I left few notes around. look for comments with 'bg-info'

I tried to recreate your styling. few nuances:
- @material/web/elevation
-- elevation made as a component is strange design - overflow:hidden will hide the shadow as well.
-- to work around this issues I copied scss from package and adjusted it:
--- removed division into before and after - it was to use different opacity of shadow. I replaced it with css relative colors applying specified opacities. additionally i added drop-shadow, to make it work with clip-path. lacking spread param its close, but not 1:1. I changed css variables from md to tqpas

employees list - 