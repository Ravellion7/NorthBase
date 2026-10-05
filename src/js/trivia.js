const TRIVIA_DATABASE = {
    norteno: {
        title: "Desafío Norteño",
        description: "Preguntas sobre la historia y equipos de la Zona Norte",
        badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
        questions: [
            {
                question: "¿En qué años consiguieron los Saraperos de Saltillo su histórico bicampeonato en la Liga Mexicana de Béisbol?",
                options: [
                    "2004 y 2005",
                    "2009 y 2010",
                    "2012 y 2013",
                    "2018 y 2019"
                ],
                answer: 1 // 2009 y 2010
            },
            {
                question: "¿Qué clásica rivalidad es conocida como el tradicional 'Clásico de Coahuila'?",
                options: [
                    "Sultanes vs Toros",
                    "Saraperos vs Algodoneros",
                    "Rieleros vs Dorados",
                    "Charros vs Tecolotes"
                ],
                answer: 1 // Saraperos vs Algodoneros
            },
            {
                question: "¿Qué franquicia de la Zona Norte juega sus partidos como local en dos países (México y EE.UU.)?",
                options: [
                    "Toros de Tijuana",
                    "Tecolotes de los Dos Laredos",
                    "Dorados de Chihuahua",
                    "Acereros de Monclova"
                ],
                answer: 1 // Tecolotes de los Dos Laredos
            },
            {
                question: "¿En qué año consiguieron los Acereros de Monclova su histórico primer campeonato de la LMB?",
                options: [
                    "1995",
                    "2007",
                    "2019",
                    "2022"
                ],
                answer: 2 // 2019
            },
            {
                question: "¿Cuál es el estadio de béisbol con mayor capacidad en toda la Zona Norte de la LMB?",
                options: [
                    "Estadio Panamericano",
                    "Estadio Monterrey (Walmart Park)",
                    "Estadio Francisco I. Madero",
                    "Estadio Chevron"
                ],
                answer: 1 // Estadio Monterrey
            },

            {
                question: "¿Cuál es el apodo tradicional e identidad cromática con la que se identifica comúnmente a los Algodoneros de Unión Laguna?",
                options: [
                    "La Furia Azul",
                    "Los Pingos",
                    "La Máquina Guinda",
                    "Los Emplumados"
                ],
                answer: 2 // La Máquina Guinda
            },
            {
                question: "¿Qué equipo de la Zona Norte ha sido multicampeón y es considerado una potencia histórica de la liga?",
                options: [
                    "Rieleros de Aguascalientes",
                    "Acereros de Monclova",
                    "Sultanes de Monterrey",
                    "Tecolotes de los Dos Laredos"
                ],
                answer: 2 // Sultanes de Monterrey (10 campeonatos)
            },
            {
                question: "¿Qué legendario jardinero mexicano, conocido como 'El Superman de Chihuahua', tuvo dos etapas con los Sultanes?",
                options: [
                    "Vinicio Castilla",
                    "Héctor Espino",
                    "Joaquín 'El Güero' Venegas",
                    "Jorge Orta"
                ],
                answer: 1 // Héctor Espino
            },
            {
                question: "¿Cómo se conoce popularmente al histórico estadio de los Sultanes de Monterrey?",
                options: [
                    "Estadio Panamericano",
                    "Estadio de la UANL",
                    "Palacio Sultán",
                    "Estadio Kukulkán"
                ],
                answer: 2 // Palacio Sultán
            },
            {
                question: "¿Cuál de estos equipos de la Zona Norte tiene su sede en el estado de Coahuila?",
                options: [
                    "Acereros de Monclova",
                    "Saraperos de Saltillo",
                    "Algodoneros de Unión Laguna",
                    "Todos los equipos mencionados"
                ],
                answer: 3 // Todos
            },
            {
                question: "¿Qué equipo de la Zona Norte de la LMB es conocido por jugar sus partidos de local en dos ciudades fronterizas (Nuevo Laredo y Laredo, Texas)?",
                options: [
                    "Tecolotes de los Dos Laredos",
                    "Toros de Tijuana",
                    "Rieleros de Aguascalientes",
                    "Acereros de Monclova"
                ],
                answer: 0 // Tecolotes de los Dos Laredos
            },
            {
                question: "¿En qué año consiguió la escuadra de los Acereros de Monclova su primer campeonato histórico en la Liga Mexicana de Béisbol?",
                options: [
                    "2007",
                    "2019",
                    "2003",
                    "2015"
                ],
                answer: 1 // 2019
            },
            {
                question: "¿Qué estado es cuna de dos importantes franquicias de la Zona Norte: Saraperos y Algodoneros?",
                options: [
                    "Coahuila",
                    "Chihuahua",
                    "Nuevo León",
                    "Jalisco"
                ],
                answer: 0 // Coahuila
            },
            {
                question: "¿Qué icónico número portaba el legendario bateador sinaloense Héctor Espino en su dorsal con los Sultanes?",
                options: [
                    "39",
                    "21",
                    "13",
                    "9"
                ],
                answer: 1 // 21
            },
            {
                question: "¿Qué equipo de la Zona Norte fue fundado en el año de 1992 y se unió a la liga en su expansión hacia el norte?",
                options: [
                    "Tecolotes de los Dos Laredos",
                    "Dorados de Chihuahua",
                    "Algodoneros de Unión Laguna",
                    "Acereros de Monclova"
                ],
                answer: 3 // Acereros de Monclova (fundados como Acereros del Norte en 1995)
            },


        ]
    },

    sultanes: {
        title: "Desafío Sultán",
        description: "Pon a prueba tus conocimientos sobre los Fantasmas Grises",
        badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
        questions: [
            {
                question: "¿En qué año fue fundada la histórica franquicia de los Sultanes de Monterrey?",
                options: [
                    "1925",
                    "1939",
                    "1955",
                    "1970"
                ],
                answer: 1 // 1939
            },
            {
                question: "¿Cuántos títulos de la LMB ostentan los Sultanes de Monterrey en sus vitrinas?",
                options: [
                    "5 campeonatos",
                    "8 campeonatos",
                    "10 campeonatos",
                    "12 campeonatos"
                ],
                answer: 2 // 10 campeonatos
            },
            {
                question: "¿Cuál es el popular apodo con el que se le conoce históricamente a los Sultanes?",
                options: [
                    "Los Fantasmas Grises",
                    "La Furia Azul",
                    "La Máquina del Norte",
                    "Los Astados"
                ],
                answer: 0 // Los Fantasmas Grises
            },
            {
                question: "¿Qué legendario bateador mexicano, 'El Superman de Chihuahua', es inmortal en Sultanes?",
                options: [
                    "Vinicio Castilla",
                    "Adrián González",
                    "Fernando Valenzuela",
                    "Héctor Espino"
                ],
                answer: 3 // Héctor Espino
            },
            {
                question: "¿Cuál es el histórico rival de los Sultanes en el llamado 'Clásico de la LMB'?",
                options: [
                    "Diablos Rojos del México",
                    "Toros de Tijuana",
                    "Saraperos de Saltillo",
                    "Charros de Jalisco"
                ],
                answer: 0 // Diablos Rojos del México
            }
        ]
    },

    charros: {
        title: "Desafío Charro",
        description: "Demuestra tu pasión albiazul por los Charros de Jalisco",
        badgeColor: "bg-sky-100 text-sky-900 border-sky-300",
        questions: [
            {
                question: "¿En qué estadio juegan sus partidos como local los Charros de Jalisco en Zapopan?",
                options: [
                    "Estadio Chevron",
                    "Estadio Francisco Villa",
                    "Estadio Monclova",
                    "Estadio Panamericano"
                ],
                answer: 3 // Estadio Panamericano
            },
            {
                question: "¿Qué característica única ostenta la franquicia de Charros en el béisbol mexicano?",
                options: [
                    "Compiten tanto en verano (LMB) como en invierno (LMP)",
                    "Juegan sin mánager extranjero",
                    "Solo juegan con peloteros novatos",
                    "Juegan en tres estados simultáneos"
                ],
                answer: 0 // Compiten en ambas ligas
            },
            {
                question: "¿Quién es el reconocido mánager de Charros que también dirigió a México en el Clásico Mundial?",
                options: [
                    "Henry Blanco",
                    "Benjamín Gil",
                    "Tony DeFrancesco",
                    "Juan Gabriel Castro"
                ],
                answer: 1 // Benjamín Gil
            },
            {
                question: "¿En qué años conquistó Charros sus dos campeonatos de verano en la historia de la LMB?",
                options: [
                    "1950 y 1955",
                    "1985 y 1990",
                    "1967 y 1971",
                    "2000 y 2005"
                ],
                answer: 2 // 1967 y 1971
            },
            {
                question: "¿Qué mítico lanzador zurdo mexicano de Grandes Ligas dejó una huella imborrable en Charros?",
                options: [
                    "Joakim Soria",
                    "Fernando 'El Toro' Valenzuela",
                    "Teodoro Higuera",
                    "Julio Urías"
                ],
                answer: 1 // Fernando Valenzuela
            }
        ]
    },

    rieleros: {
        title: "Desafío Rielero",
        description: "Todo sobre la Máquina del Riel de Aguascalientes",
        badgeColor: "bg-yellow-100 text-yellow-900 border-yellow-300",
        questions: [
            {
                question: "¿Cuál es el apodo tradicional de los Rieleros de Aguascalientes?",
                options: [
                    "El Sarape Mecánico",
                    "La Furia Azul",
                    "La Máquina Pitia",
                    "La Tribu Hidrocálida"
                ],
                answer: 2 // La Máquina Pitia
            },
            {
                question: "¿En qué año consiguieron los Rieleros su histórico campeonato en la LMB?",
                options: [
                    "1965",
                    "1989",
                    "1978",
                    "2001"
                ],
                answer: 2 // 1978
            },
            {
                question: "¿Cómo se llama el tradicional parque de pelota de los Rieleros?",
                options: [
                    "Parque Alberto Romo Chávez",
                    "Estadio Monumental",
                    "Estadio de la Revolución",
                    "Parque La Junta"
                ],
                answer: 0 // Parque Alberto Romo Chávez
            },
            {
                question: "¿Cuáles son los colores tradicionales representativos de los Rieleros?",
                options: [
                    "Verde y rojo",
                    "Guinda y blanco",
                    "Naranja y negro",
                    "Azul marino y amarillo"
                ],
                answer: 3 // Azul marino y amarillo
            },
            {
                question: "¿A qué se debe el nombre del club 'Rieleros' en Aguascalientes?",
                options: [
                    "A los fundadores ciclistas",
                    "A la emblemática historia ferrocarrilera del estado",
                    "A un río caudaloso de la zona",
                    "Al primer patrocinador minero"
                ],
                answer: 1 // Historia ferrocarrilera
            }
        ]
    },

    algodoneros: {
        title: "Desafío Algodonero",
        description: "Pon a prueba tu conocimiento sobre Unión Laguna",
        badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
        questions: [
            {
                question: "¿En qué estadio y ciudad juegan como locales los Algodoneros del Unión Laguna?",
                options: [
                    "Saltillo en el Francisco I. Madero",
                    "Torreón en el Estadio de la Revolución",
                    "Durango en el Francisco Villa",
                    "Monclova en el Estadio Monclova"
                ],
                answer: 1 // Torreón en el Estadio de la Revolución
            },
            {
                question: "¿En qué años consiguieron los Algodoneros sus campeonatos en la LMB?",
                options: [
                    "1942 y 1950",
                    "1965 y 1970",
                    "1981 y 1985",
                    "2001 y 2005"
                ],
                answer: 0 // 1942 y 1950
            },
            {
                question: "¿Cuál es el color emblemático y distintivo de los Algodoneros?",
                options: [
                    "Rojo carmesí",
                    "Azul rey",
                    "Guinda",
                    "Verde esmeralda"
                ],
                answer: 2 // Guinda
            },
            {
                question: "¿Qué región norteña representan con orgullo los Algodoneros?",
                options: [
                    "La Huasteca",
                    "La Comarca Lagunera",
                    "El Valle de Mexicali",
                    "La Sierra Tarahumara"
                ],
                answer: 1 // La Comarca Lagunera
            },
            {
                question: "¿Contra qué equipo disputan el afamado 'Clásico de Coahuila'?",
                options: [
                    "Sultanes de Monterrey",
                    "Tecolotes de los Dos Laredos",
                    "Toros de Tijuana",
                    "Saraperos de Saltillo"
                ],
                answer: 3 // Saraperos de Saltillo
            }
        ]
    },

    caliente: {
        title: "Desafío Caliente",
        description: "Demuestra cuánto sabes sobre Caliente de Durango",
        badgeColor: "bg-red-100 text-red-900 border-red-300",
        questions: [
            {
                question: "¿En qué año nació la franquicia de Caliente de Durango en la LMB?",
                options: [
                    "2018",
                    "2021",
                    "2024",
                    "2026"
                ],
                answer: 2 // 2024
            },
            {
                question: "¿Cuál es la casa de Caliente de Durango?",
                options: [
                    "Estadio Monclova",
                    "Estadio Chevron",
                    "Estadio Panamericano",
                    "Estadio Francisco Villa"
                ],
                answer: 3 // Estadio Francisco Villa
            },
            {
                question: "¿Quién asumió como mánager guiando al equipo a la postemporada?",
                options: [
                    "Óscar Robles",
                    "Benjamín Gil",
                    "Henry Blanco",
                    "Roberto Kelly"
                ],
                answer: 0 // Óscar Robles
            },
            {
                question: "¿A qué franquicia sustituyó Caliente para continuar el béisbol en Durango?",
                options: [
                    "Broncos",
                    "Generales de Durango",
                    "Tuneros",
                    "Cafeteros"
                ],
                answer: 1 // Generales de Durango
            },
            {
                question: "¿Cuáles son los colores principales de Caliente de Durango?",
                options: [
                    "Rojo, negro y blanco",
                    "Azul y oro",
                    "Naranja y gris",
                    "Verde y blanco"
                ],
                answer: 0 // Rojo, negro y blanco
            }
        ]
    },

    toros: {
        title: "Desafío Toros",
        description: "Demuestra tu conocimiento fronterizo de los Toros de Tijuana",
        badgeColor: "bg-red-100 text-red-900 border-red-300",
        questions: [
            {
                question: "¿En qué estadio juegan sus partidos como local los Toros de Tijuana?",
                options: [
                    "Estadio Panamericano",
                    "Estadio Francisco I. Madero",
                    "Estadio Romo Chávez",
                    "Estadio Chevron"
                ],
                answer: 3 // Estadio Chevron
            },
            {
                question: "¿En qué temporadas se coronaron campeones de la LMB los Toros?",
                options: [
                    "2010, 2014 y 2026",
                    "2017, 2021 y 2026",
                    "2015, 2019 y 2026",
                    "2012, 2018 y 2026"
                ],
                answer: 1 // 2017, 2021 y 2026
            },
            {
                question: "¿Con qué apodo se le conoce habitualmente al conjunto tijuanense?",
                options: [
                    "Los Astados",
                    "Los Fantasmas",
                    "La Máquina",
                    "Los Bélicos"
                ],
                answer: 0 // Los Astados
            },
            {
                question: "¿En las faldas de qué cerro tijuanense se encuentra ubicado el Estadio Chevron?",
                options: [
                    "Cerro de la Silla",
                    "Cerro del Obispado",
                    "Cerro Colorado",
                    "Cerro Coronel"
                ],
                answer: 2 // Cerro Colorado
            },
            {
                question: "¿Qué ex figura de Grandes Ligas y guante de oro ha dirigido a los Toros?",
                options: [
                    "Omar Vizquel",
                    "Vinicio Castilla",
                    "Tony La Russa",
                    "Dusty Baker"
                ],
                answer: 0 // Omar Vizquel
            }
        ]
    },

    saraperos: {
        title: "Desafío Saraperos",
        description: "Todo sobre la Nave Verde de Saltillo",
        badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
        questions: [
            {
                question: "¿Qué gran hazaña consiguieron los Saraperos de Saltillo en 2009 y 2010?",
                options: [
                    "Récord de cuadrangulares",
                    "Temporada invicta",
                    "El histórico Bicampeonato de la LMB",
                    "Ganar la Serie del Caribe"
                ],
                answer: 2 // El Bicampeonato
            },
            {
                question: "¿Cómo se llama el estadio casa de los Saraperos en Saltillo?",
                options: [
                    "Estadio Francisco I. Madero",
                    "Estadio Romo Chávez",
                    "Parque La Junta",
                    "Estadio Monumental"
                ],
                answer: 0 // Estadio Francisco I. Madero
            },
            {
                question: "¿Cuál es el color tradicional y distintivo que identifica a la 'Nave Verde'?",
                options: [
                    "Verde sarape",
                    "Azul cielo",
                    "Naranja brillante",
                    "Morado"
                ],
                answer: 0 // Verde sarape
            },
            {
                question: "¿Cuál es la carismática e histórica mascota de los Saraperos?",
                options: [
                    "Kike Conejo",
                    "El Toro Torín",
                    "El Sultán",
                    "Chacho"
                ],
                answer: 0 // Kike Conejo
            },
            {
                question: "¿En qué año fue fundada la franquicia de los Saraperos de Saltillo?",
                options: [
                    "1950",
                    "1995",
                    "1985",
                    "1970"
                ],
                answer: 3 // 1970
            }
        ]
    },

    tecos: {
        title: "Desafío Teco",
        description: "Conoce al único equipo transfronterizo de los Dos Laredos",
        badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
        questions: [
            {
                question: "¿Por qué los Tecolotes son conocidos como el equipo de los 'Dos Laredos'?",
                options: [
                    "Tienen dos dueños",
                    "Tienen dos mascotas",
                    "Juegan en Nuevo Laredo (México) y Laredo (Texas, EE.UU.)",
                    "Cuentan con dos estadios en Tamaulipas"
                ],
                answer: 2 // Juegan en dos países
            },
            {
                question: "¿Cuáles son los dos estadios donde disputan sus juegos como local?",
                options: [
                    "Estadio Romo Chávez y Francisco Villa",
                    "Estadio Chevron y Estadio Monclova",
                    "Parque La Junta y Uni-Trade Stadium",
                    "Estadio Monterrey y Panamericano"
                ],
                answer: 2 // Parque La Junta y Uni-Trade Stadium
            },
            {
                question: "¿Cuántos títulos de la LMB ostentan los Tecolotes en su historia?",
                options: [
                    "2 campeonatos",
                    "1 campeonato",
                    "8 campeonatos",
                    "5 campeonatos"
                ],
                answer: 3 // 5 campeonatos
            },
            {
                question: "¿Cuál es el ave emblemática que da nombre e identidad al club?",
                options: [
                    "El Águila Real",
                    "El Tecolote (Búho)",
                    "El Halcón",
                    "El Cardenal"
                ],
                answer: 1 // El Tecolote
            },
            {
                question: "¿En qué década consiguieron los Tecolotes su primer bicampeonato?",
                options: [
                    "Años 1950",
                    "Años 1970",
                    "Años 1980",
                    "Años 2000"
                ],
                answer: 0 // Años 1950
            }
        ]
    },

    dorados: {
        title: "Desafío Dorados",
        description: "Demuestra tu pasión por la División del Norte de Chihuahua",
        badgeColor: "bg-yellow-100 text-yellow-900 border-yellow-300",
        questions: [
            {
                question: "¿Cómo se llama el estadio casa de los Dorados de Chihuahua?",
                options: [
                    "Estadio Monumental Chihuahua",
                    "Estadio Francisco Villa",
                    "Parque Romo Chávez",
                    "Estadio Chevron"
                ],
                answer: 0 // Estadio Monumental Chihuahua
            },
            {
                question: "¿En qué año se dio el más reciente regreso de Dorados a la LMB?",
                options: [
                    "2018",
                    "2021",
                    "2024",
                    "2026"
                ],
                answer: 2 // 2024
            },
            {
                question: "¿Qué histórico concepto revolucionario está ligado a Chihuahua y al club?",
                options: [
                    "La División del Norte",
                    "La Furia Azul",
                    "Los Cañoneros",
                    "La Máquina"
                ],
                answer: 0 // La División del Norte
            },
            {
                question: "¿Cuáles son los colores tradicionales de los Dorados de Chihuahua?",
                options: [
                    "Rojo y negro",
                    "Oro y púrpura",
                    "Azul y blanco",
                    "Verde y plata"
                ],
                answer: 1 // Oro y purpura
            },
            {
                question: "¿Cómo es conocido tradicionalmente el estado de Chihuahua en el béisbol?",
                options: [
                    "El Corazón Minero",
                    "La Perla del Norte",
                    "La Bella Airosa",
                    "El Estado Grande"
                ],
                answer: 3 // El Estado Grande
            }
        ]
    },

    acereros: {
        title: "Desafío Acerero",
        description: "Todo sobre la Furia Azul de Monclova",
        badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
        questions: [
            {
                question: "¿En qué año ganaron los Acereros de Monclova su primer título de la LMB?",
                options: [
                    "1995",
                    "2007",
                    "2019",
                    "2023"
                ],
                answer: 2 // 2019
            },
            {
                question: "¿Cómo se le conoce popularmente a los Acereros de Monclova?",
                options: [
                    "La Nave de Acero",
                    "Los Fantasmas",
                    "Los Astados",
                    "La Furia Azul"
                ],
                answer: 3 // La Furia Azul
            },
            {
                question: "¿Cómo es apodado el Estadio Monclova por su ambiente y clima?",
                options: [
                    "El Volcán del Norte",
                    "El Horno Más Grande de México",
                    "La Fortaleza de Acero",
                    "El Nido Azul"
                ],
                answer: 1 // El Horno Más Grande de México
            },
            {
                question: "¿Contra qué equipo sostienen una intensa rivalidad en Coahuila?",
                options: [
                    "Saraperos de Saltillo",
                    "Diablos Rojos",
                    "Dorados de Chihuahua",
                    "Charros de Jalisco"
                ],
                answer: 0 // Saraperos de Saltillo
            },
            {
                question: "¿Quién fue el mánager estadounidense que guió a Monclova al título en 2019?",
                options: [
                    "Pat Listach",
                    "Tony DeFrancesco",
                    "Henry Blanco",
                    "Terry Collins"
                ],
                answer: 0 // Pat Listach
            }
        ]
    }
};

// Aliases para compatibilidad
TRIVIA_DATABASE.calientes = TRIVIA_DATABASE.caliente;
TRIVIA_DATABASE.tecolotes = TRIVIA_DATABASE.tecos;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener parámetro de URL (?trivia=sultanes, etc.)
    const urlParams = new URLSearchParams(window.location.search);
    const triviaKey = (urlParams.get('trivia') || 'norteno').toLowerCase();

    const activeTrivia = TRIVIA_DATABASE[triviaKey] || TRIVIA_DATABASE['norteno'];
    const questions = activeTrivia.questions;
    const totalQuestions = questions.length;

    let currentIndex = 0;
    let selectedOptionIndex = null;
    let score = 0;
    let isAnswerSubmitted = false;

    // Elementos DOM
    const badgeEl = document.getElementById('trivia-badge');
    const counterEl = document.getElementById('trivia-counter');
    const progressBar = document.getElementById('trivia-progress-bar');
    const questionTextEl = document.getElementById('trivia-question');
    const optionsContainer = document.getElementById('trivia-options');
    const nextBtn = document.getElementById('trivia-next-btn');
    const quizCard = document.getElementById('trivia-card');
    const controlsContainer = document.getElementById('trivia-controls');

    // Inicializar badge de título
    if (badgeEl) {
        badgeEl.textContent = activeTrivia.title;
        if (activeTrivia.badgeColor) {
            badgeEl.className = `inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs sm:text-sm font-['Poppins',sans-serif] font-bold border shadow-sm ${activeTrivia.badgeColor}`;
        }
    }

    // Actualizar título de la pestaña del navegador
    document.title = `NorthBase - ${activeTrivia.title}`;

    // Renderizar pregunta actual
    function renderQuestion() {
        isAnswerSubmitted = false;
        selectedOptionIndex = null;

        const currentQ = questions[currentIndex];

        // Actualizar contador
        if (counterEl) {
            counterEl.textContent = `${currentIndex + 1}/${totalQuestions}`;
        }

        // Actualizar barra de progreso
        if (progressBar) {
            const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;
            progressBar.style.width = `${progressPercent}%`;
        }

        // Actualizar enunciado de la pregunta
        if (questionTextEl) {
            questionTextEl.textContent = currentQ.question;
        }

        // Renderizar opciones
        if (optionsContainer) {
            optionsContainer.innerHTML = '';

            currentQ.options.forEach((optText, optIdx) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'trivia-option-btn w-full min-h-[44px] sm:min-h-[48px] px-4 py-2 bg-white border-2 border-slate-800 border-b-4 rounded-xl font-[\'Poppins\',sans-serif] font-medium text-slate-900 text-xs sm:text-sm text-left hover:bg-slate-50 active:scale-[0.99] transition-all cursor-pointer shadow-sm flex items-center justify-between gap-3';
                btn.setAttribute('data-index', optIdx);

                btn.innerHTML = `
                    <span class="flex-1">${optText}</span>
                    <span class="option-icon w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center shrink-0 text-xs"></span>
                `;

                btn.addEventListener('click', () => {
                    if (isAnswerSubmitted) return;
                    selectOption(optIdx);
                });

                optionsContainer.appendChild(btn);
            });
        }

        // Actualizar texto del botón siguiente
        if (nextBtn) {
            nextBtn.textContent = (currentIndex === totalQuestions - 1) ? 'Ver Resultados' : 'Siguiente';
            nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    // Manejar selección de opción
    function selectOption(index) {
        selectedOptionIndex = index;
        const optionBtns = optionsContainer.querySelectorAll('.trivia-option-btn');

        optionBtns.forEach((btn, idx) => {
            const iconSpan = btn.querySelector('.option-icon');
            if (idx === index) {
                // Estado seleccionado
                btn.classList.add('border-[#C1121F]', 'bg-red-50/50', 'text-[#C1121F]', 'shadow-md');
                btn.classList.remove('border-slate-800', 'bg-white', 'text-slate-900');
                if (iconSpan) {
                    iconSpan.className = 'option-icon w-5 h-5 rounded-full bg-[#C1121F] text-white flex items-center justify-center shrink-0 text-xs font-bold';
                    iconSpan.innerHTML = '●';
                }
            } else {
                btn.classList.remove('border-[#C1121F]', 'bg-red-50/50', 'text-[#C1121F]', 'shadow-md');
                btn.classList.add('border-slate-800', 'bg-white', 'text-slate-900');
                if (iconSpan) {
                    iconSpan.className = 'option-icon w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center shrink-0 text-xs';
                    iconSpan.innerHTML = '';
                }
            }
        });
    }

    // Evaluar respuesta y avanzar
    function handleNext() {
        if (selectedOptionIndex === null) {
            // Animación sutil de aviso si no ha seleccionado
            if (optionsContainer) {
                optionsContainer.classList.add('animate-pulse');
                setTimeout(() => optionsContainer.classList.remove('animate-pulse'), 500);
            }
            return;
        }

        const currentQ = questions[currentIndex];
        const optionBtns = optionsContainer.querySelectorAll('.trivia-option-btn');

        if (!isAnswerSubmitted) {
            isAnswerSubmitted = true;
            const isCorrect = (selectedOptionIndex === currentQ.answer);

            if (isCorrect) {
                score++;
            }

            // Revelar respuestas correcta e incorrecta
            optionBtns.forEach((btn, idx) => {
                const iconSpan = btn.querySelector('.option-icon');
                btn.classList.remove('hover:bg-slate-50', 'cursor-pointer');
                btn.classList.add('cursor-default');

                if (idx === currentQ.answer) {
                    // Correcta -> Verde
                    btn.classList.remove('border-slate-800', 'border-[#C1121F]', 'bg-red-50/50', 'text-slate-900', 'text-[#C1121F]');
                    btn.classList.add('border-emerald-600', 'bg-emerald-50', 'text-emerald-800', 'font-bold');
                    if (iconSpan) {
                        iconSpan.className = 'option-icon w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold';
                        iconSpan.innerHTML = '✓';
                    }
                } else if (idx === selectedOptionIndex && !isCorrect) {
                    // Incorrecta seleccionada -> Roja
                    btn.classList.remove('border-slate-800', 'border-[#C1121F]', 'bg-red-50/50', 'text-slate-900', 'text-[#C1121F]');
                    btn.classList.add('border-red-600', 'bg-red-50', 'text-red-700');
                    if (iconSpan) {
                        iconSpan.className = 'option-icon w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 text-xs font-bold';
                        iconSpan.innerHTML = '✕';
                    }
                } else {
                    btn.classList.add('opacity-50');
                }
            });

            // Cambiar botón a continuar
            nextBtn.textContent = (currentIndex === totalQuestions - 1) ? 'Ver Resultados' : 'Continuar ➔';
            return;
        }

        // Si ya fue evaluada, pasar a la siguiente pregunta
        currentIndex++;
        if (currentIndex < totalQuestions) {
            renderQuestion();
        } else {
            showResults();
        }
    }

    // Pantalla de Resultados Finales
    function showResults() {
        if (!quizCard) return;

        // Ocultar barra de botones externa
        if (controlsContainer) {
            controlsContainer.classList.add('hidden');
        }

        // Mensaje personalizado según puntaje
        const percent = (score / totalQuestions) * 100;
        let resultTitle = "¡Gran intento!";
        let resultMsg = "Sigue practicando para convertirte en el mayor experto de la Zona Norte.";
        let iconSrc = "./src/assets/baseball icon.png";

        if (percent === 100) {
            resultTitle = "¡Perfecto, Home run!";
            resultMsg = "¡Eres un auténtico maestro del béisbol norteño! No se te escapa ningún detalle.";
            iconSrc = "./src/assets/trophy icon.png";
        } else if (percent >= 70) {
            resultTitle = "¡Excelente Jugada!";
            resultMsg = "Tienes un gran conocimiento de la liga y de tus equipos favoritos.";
            iconSrc = "./src/assets/star icon.png";
        }

        quizCard.innerHTML = `
            <div class="w-full flex flex-col items-center justify-center text-center py-6 sm:py-8">
                <div class="mb-4 flex items-center justify-center">
                    <img src="${iconSrc}" alt="Resultado" class="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md" />
                </div>
                
                <h2 class="font-['Poppins',sans-serif] text-2xl sm:text-3xl font-extrabold text-[#0A1A32] mb-2 tracking-wide">
                    ${resultTitle}
                </h2>
                
                <p class="font-['Poppins',sans-serif] text-xs sm:text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
                    ${resultMsg}
                </p>

                <!-- Tarjeta de Puntuación -->
                <div class="w-full max-w-xs bg-slate-50 border-2 border-orange-200 border-b-4 border-r-4 border-b-orange-400 border-r-orange-400 rounded-2xl p-5 mb-8 shadow-md">
                    <span class="block text-xs uppercase font-bold text-slate-500 tracking-wider mb-1">Tu Puntuación</span>
                    <div class="text-4xl sm:text-5xl font-extrabold text-[#C1121F] font-['Poppins',sans-serif]">
                        ${score} <span class="text-xl text-slate-400 font-semibold">/ ${totalQuestions}</span>
                    </div>
                    <span class="block text-xs font-semibold text-slate-600 mt-2">
                        ${Math.round(percent)}% de respuestas correctas
                    </span>
                </div>

                <!-- Botones de Acción -->
                <div class="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-sm">
                    <button id="trivia-retry-btn" type="button"
                        class="w-full sm:w-auto flex-1 px-6 py-3 bg-[#C1121F] hover:bg-[#9b0e19] text-white font-['Poppins',sans-serif] font-bold text-xs sm:text-sm rounded-full shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-center tracking-wide whitespace-nowrap cursor-pointer">
                        Reintentar Desafío
                    </button>

                    <a href="./trivia_select.html"
                        class="w-full sm:w-auto flex-1 px-6 py-3 bg-[#0A1A32] hover:bg-[#132c54] text-white font-['Poppins',sans-serif] font-bold text-xs sm:text-sm rounded-full shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-center tracking-wide whitespace-nowrap cursor-pointer">
                        Elegir Otra Trivia
                    </a>
                </div>
            </div>
        `;

        const retryBtn = document.getElementById('trivia-retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                location.reload();
            });
        }
    }

    // Listener del botón siguiente
    if (nextBtn) {
        nextBtn.addEventListener('click', handleNext);
    }

    // Iniciar primer pregunta
    renderQuestion();
});
