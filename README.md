# Aquarius

The aquarius water quality evaluation station will be a programmable autonomous terminal. It will have acces to cellular network to transmit data to CloudIA, a scientific database and data visualisation interface.

The terminal evaluates water quality by acquiring acidity level (pH), water conductivity (µS/cm), dissolved oxygen (mg/L) and temperature(℃).  

-------------------------------------------------------------------------------------------------------------------------

La station d’évaluation de la qualité de l’eau Aquarius sera une borne autonome programmable. Elle aura la capacité de communiquer par réseau cellulaire ses données au logiciel CloudIA, une interface de visualisation de données scientifiques .

La borne permettra d’évaluer la qualité de l’eau en recueillant des mesures d’acidité (pH), de conductivité (µS/cm), de la concentration d’oxygène dissous (mg/L) et de la température (℃).

-------------------------------------------------------------------------------------------------------------------------

Aquarius is a Beaglebone Black with pH, dissolved oxygen, and conductivity sensors built by Atlas Scientific and a water temperature sensor by Dallas Semiconductor.

Each sensor has its own driver to calibrate or read a value. Those drivers are executed by an interface hosted on the apache server (/var/www) with a real-time interface written in Html connected to the server with Node.Js.




