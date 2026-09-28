const TEAMS_DATABASE = {
    sultanes: {
        name: "Sultanes de Monterrey",
        titleImage: "./src/assets/Sultanes Mty.png",
        galleryUrl: "./sultanes_gallery.html?team=sultanes",
        info: `Los Sultanes de Monterrey, conocidos popularmente como los "Fantasmas Grises", son uno de los equipos más históricos, ganadores y tradicionales de la Liga Mexicana de Béisbol (LMB). Fundados en 1939, son la franquicia con más temporadas consecutivas jugando en el circuito veraniego.
        <br><br>
        Información General del Club<br>
        - Títulos de la LMB: 10 campeonatos en su historia (1943, 1947, 1948, 1949, 1962, 1991, 1995, 1996, 2007 y Otoño 2018).<br>
        - Casa: Walmart Park (Estadio Monterrey), con capacidad para 22,078 espectadores.<br>
        - Mánager Actual: Henry Blanco.<br>
        - Rivalidad histórica: Diablos Rojos del México ("Clásico de la LMB").
        <br><br>
        Actualidad Deportiva (Temporada 2026)<br>
        La novena regiomontana se encuentra viviendo un momento de alta competencia en la postemporada, disputando intensamente la Serie de Campeonato de la Zona Norte.`
    },
    rieleros: {
        name: "Rieleros de Aguascalientes",
        titleImage: "./src/assets/RIELEROS.png", // Tu imagen de RIELEROS
        galleryUrl: "./sultanes_gallery.html?team=rieleros",
        info: `Los Rieleros de Aguascalientes son un equipo profesional de béisbol con gran arraigo e historia en la Liga Mexicana de Béisbol (LMB), fundados en 1975 en la emblemática ciudad ferrocarrilera.
        <br><br>
        Información General del Club<br>
        - Títulos de la LMB: 1 campeonato histórico (1978).<br>
        - Casa: Parque Alberto Romo Chávez en Aguascalientes.<br>
        - Apodo: La Máquina del Riel.<br>
        - Colores tradicionales: Azul marino y amarillo.
        <br><br>
        Actualidad Deportiva (Temporada 2026)<br>
        El conjunto hidrocálido se destaca por su ofensiva explosiva y una fiel afición que llena el Romo Chávez en cada serie de la Zona Norte.`
    },
    charros: {
        name: "Charros de Jalisco",
        titleImage: "./src/assets/CHARROS.png",
        galleryUrl: "./sultanes_gallery.html?team=charros",
        info: `Los Charros de Jalisco son una de las organizaciones con mayor arraigo e impacto mediático en el país. Presumen un estatus sumamente especial, ya que desde su regreso al circuito de verano en 2024 tras adquirir la franquicia de los Mariachis, se convirtieron en el único equipo en competir activamente tanto en la liga veraniega (LMB) como en la invernal (LMP). Su rica historia abarca grandes leyendas del béisbol mexicano, incluyendo a Fernando "El Toro" Valenzuela.
        <br><br>
        Información General del Club<br>
        - Títulos de la LMB: 2 campeonatos en su historia veraniega (1967 y 1971) (Nota: También cuentan con varios títulos en la LMP invernal).<br>
        - Casa: Estadio Panamericano (Zapopan, Jalisco), con capacidad para 16,500 espectadores.<br>
        - Mánager Actual: Benjamín Gil.<br>
        - Rivalidad Histórica:  Sultanes de Monterrey, Toros de Tijuana y Diablos Rojos del México.<br><br>
        - Actualidad Deportiva (Temporada 2026): <br>
  Bajo la dirección del reconocido mánager Benjamín Gil, la novena albiazul tuvo una gran temporada regular en la Zona Norte que les permitió conquistar su boleto a la postemporada. Disputaron intensamente el Primer Playoff enfrentando en una serie muy peleada a los Sultanes de Monterrey.`
    },
    algodoneros: {
        name: "Algodoneros del Unión Laguna",
        titleImage: "./src/assets/ALGODONEROS.png",
        galleryUrl: "./sultanes_gallery.html?team=algodoneros",
        info: `Los Algodoneros del Unión Laguna son una de las franquicias con mayor tradición en el circuito, representando orgullosamente a la Comarca Lagunera desde su fundación original en 1940. Tras algunas ausencias y cambios de nombre, la histórica identidad algodonera regresó con fuerza para consolidarse en el norte del país.
        <br><br>
        Información General del Club<br>
        - Títulos de la LMB: 2 campeonatos (1942, 1950).<br>
        - Casa: Estadio de la Revolución (Torreón, Coahuila), con capacidad para 9,500 espectadores.<br>
        - Mánager Actual: Ramón Santiago.<br>
        - Rivalidad Histórica: Saraperos de Saltillo ("Clásico de Coahuila") y Acereros de Monclova. <br><br>
        - Actualidad Deportiva (Temporada 2026): <br>
        Vivieron un cierre de campaña regular de mucha presión buscando colarse al último cupo de la postemporada de la Zona Norte frente a los Rieleros.`
    },
    caliente: {
        name: "Caliente de Durango",
        titleImage: "./src/assets/CALIENTE.png",
        galleryUrl: "./sultanes_gallery.html?team=caliente",
        info: `Caliente de Durango es una de las organizaciones más jóvenes del circuito, nacida en 2024 para darle continuidad al rey de los deportes en tierras duranguenses tras la salida de los Generales. Con una identidad renovada y agresiva, se han ganado rápidamente a su fanaticada.
        <br><br>
        Información General del Club<br>
        - Títulos de la LMB: No registran campeonatos (franquicia de reciente expansión).<br>
        - Casa: Estadio Francisco Villa, con capacidad para 4,943 espectadores.<br>
        - Mánager Actual: Óscar Robles.<br>
        - Rivalidad Histórica: Desarrollando rivalidades con los equipos de la Zona Norte, particularmente con la frontera. <br><br>
        - Actualidad Deportiva (Temporada 2026): <br>
        El club consolidó un gran año deportivo de la mano de su directiva y cuerpo técnico, cumpliendo las metas de calificar holgadamente y amarrar el inicio de la primera serie de playoffs en calidad de local.`
    },
    acereros: {
        name: "Acereros de Monclova",
        titleImage: "./src/assets/ACEREROS.png",
        galleryUrl: "./sultanes_gallery.html?team=acereros",
        info: `Los Acereros de MOnclova, conocidos popularmente como "La Furia Azul", son una escuadra sumamente competitiva y apasionada del estado de Coahuila. Fundados de forma definitiva en 1976 (con antecedentes previos en el circuito), se han caracterizado por armar planteles explosivos de primer nivel.
        <br><br>
        Información General del Club<br>
        - Títulos de la LMB: 1 campeonato en su historia (2019).<br>
        - Casa: Estadio Monclova, con capacidad para 8,500 espectadores.<br>
        - Mánager Actual: Juan Gabriel Castro.<br>
        - Rivalidad Histórica: Saraperos de Saltillo ("Clásico Coahuilense") y Sultanes de Monterrey. <br><br>
        - Actualidad Deportiva (Temporada 2026): <br>
       Consiguieron mantenerse como uno de los equipos recurrentes e incómodos en la lucha de arriba dentro del Norte, clasificando a la postemporada.`
    },
    toros: {
        name: "Toros de Tijuana",
        titleImage: "./src/assets/TOROS.png",
        galleryUrl: "./sultanes_gallery.html?team=toros",
        info: `Los Toros de Tijuana son una de las potencias modernas de la LMB. Aunque tuvieron una breve etapa inicial en 2004, su regreso definitivo en 2014 revolucionó la forma de vivir el béisbol en la frontera, destacándose por sus grandes inversiones, dinámicas de entretenimiento y un protagonismo constante.
        <br><br>
        Información General del Club<br>
        - Títulos de la LMB: 2 campeonatos en su historia (2017 y 2021).<br>
        - Casa: Estadio Chevron (antes Toros Mobil Park), con capacidad para 17,000 espectadores.<br>
        - Mánager Actual: Roberto Kelly.<br>
        - Rivalidad Histórica: Sultanes de Monterrey y Tecos de los Dos Laredos. <br><br>
        - Actualidad Deportiva (Temporada 2026): <br>
      Bajo el mando del experimentado panameño Roberto Kelly, la novena tijuanense firmó otra gran campaña para asegurar casa en los playoffs del Norte y mantenerse firmes en la lucha hacia la Serie del Rey.`
    },
    saraperos: {
        name: "Saraperos de Saltillo",
        titleImage: "./src/assets/SARAPEROS.png",
        galleryUrl: "./sultanes_gallery.html?team=saraperos",
        info: `Los Saraperos de Saltillo, cariñosamente apodados como "La Nave Verde", fueron fundados en 1970 y son uno de los equipos más estables, queridos y de mayor arrastre en el norte de México, recordados por su histórica época del bicampeonato.
        <br><br>
        Información General del Club<br>
        - Títulos de la LMB: 3 campeonatos en su historia (1980 —Título Extraordinario—, 2009 y 2010).<br>
        - Casa: Estadio Francisco I. Madero, con capacidad para 14,000 espectadores.<br>
        - Mánager Actual: José Molina.<br>
        - Rivalidad Histórica: Sultanes de Monterrey ("Clásico del Norte") y Algodoneros de Unión Laguna.<br><br>
        - Actualidad Deportiva (Temporada 2026): <br>
     El club buscó recuperar terreno competitivo en el standing de la mano de un renovado staff dominicano y extranjero en su roster para pelear los puestos de vanguardia en la siempre complicada Zona Norte.`
    },
    tecos: {
        name: "Tecos de los Dos Laredos",
        titleImage: "./src/assets/TECOS.png",
        galleryUrl: "./sultanes_gallery.html?team=tecos",
        info: `Los Tecos de los Dos Laredos son la única franquicia genuinamente binacional en el béisbol profesional, dividiendo sus encuentros como locales entre México y Estados Unidos. Fundados originalmente en 1940 como Tecolotes, presumen una rica e histórica herencia fronteriza.
        <br><br>
        Información General del Club<br>
        - Títulos de la LMB: 5 campeonatos en su historia (1953, 1954, 1958, 1977 y 1989).<br>
        - Casa: Parque La Junta (Nuevo Laredo, Tamaulipas) y Uni-Trade Stadium (Laredo, Texas).<br>
        - Mánager Actual: Mendy López Aude.<br>
        - Rivalidad Histórica:  Sultanes de Monterrey y Toros de Tijuana.<br><br>
        - Actualidad Deportiva (Temporada 2026): <br>
    A mitad del calendario la gerencia le entregó el mando de la novena a Mendy López para ajustar las tuercas. Se mantuvieron peleando codo a codo series clave frente a escuadras norteñas.`
    },
    dorados: {
        name: "Dorados de Chihuahua",
        titleImage: "./src/assets/DORADOS.png",
        galleryUrl: "./sultanes_gallery.html?team=dorados",
        info: `Los Dorados de Chihuahua regresaron formalmente a la LMB en 2024 en su tercera etapa histórica dentro del circuito de verano. El "Estado Grande", meramente beisbolero, recuperó su plaza para revivir la espectacular tradición de la "División del Norte".
        <br><br>
        Información General del Club<br>
        - Títulos de la LMB: No registran campeonatos.<br>
        - Casa:  Estadio Monumental Chihuahua, con capacidad para 14,500 espectadores.<br>
        - Mánager Actual: Tony DeFrancesco.<br>
        - Rivalidad Histórica: Algodoneros del Unión Laguna y Caliente de Durango.<br><br>
        - Actualidad Deportiva (Temporada 2026): <br>
   Con la incorporación a finales del verano del experimentado mánager ligamayorista Tony DeFrancesco, la directiva dorada continúa estructurando las bases sólidas de su proyecto deportivo para meterse de lleno a competir en las postemporadas venideras de la liga.`
    }

    // Puedes ir agregando acereros, algodoneros, calientes, toros, saraperos, tecos, dorados...
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Leer el parámetro ?team= de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const teamKey = (urlParams.get('team') || 'sultanes').toLowerCase();

    // 2. Obtener los datos del equipo seleccionado (o Sultanes por defecto)
    const teamData = TEAMS_DATABASE[teamKey] || TEAMS_DATABASE['sultanes'];

    // 3. Actualizar la página dinámicamente
    const titleImg = document.getElementById('team-title-img');
    const multimediaBtn = document.getElementById('team-multimedia-btn');
    const infoText = document.getElementById('team-info-text');

    if (titleImg) {
        titleImg.src = teamData.titleImage;
        titleImg.alt = teamData.name;
    }

    if (multimediaBtn) {
        multimediaBtn.href = teamData.galleryUrl;
    }

    if (infoText) {
        infoText.innerHTML = teamData.info;
    }

    // Actualizar título de la pestaña del navegador
    document.title = `NorthBase - ${teamData.name}`;
});
