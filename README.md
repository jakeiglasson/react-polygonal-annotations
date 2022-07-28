This code project refactors the code found here: http://jsfiddle.net/mz1cfb9v/13/ into react components. Namely the components PolygonImage and PolygonAnnotation.

Qtip:

In the original code, a jquery plugin called qtip was used.

While hovering over a selection, qtip is used to render the name of the selection at the mouse position.
This is done instead of having the text appear in a static place so as to not cover parts of the image permanently.

Qtip however is deprecated, therefore a custom solution is provided.
