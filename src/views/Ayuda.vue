<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
//import { useToast } from 'primevue/usetoast';

const display = ref(true);
const router = useRouter();
const position = ref('top');
//const toast = useToast();


function closeDialog() {
    display.value = false;
    router.push('/app');
}

function onDialogHide() {
    if (!display.value) {
        router.push('/app');
    }
}

</script>

<template>
    <Dialog header="Ayuda" v-model:visible="display" :style="{ width: '40vw', height: '80%' }" :modal="true"
        class="p-fluid" @hide="onDialogHide" :position="position" :draggable="false">
        <TabView :scrollable="true">
            <TabPanel header="Objetivo">
                <p class="line-height-3 m-0 text-justify">
                    Tu tarea es diagnosticar y tratar a este paciente como lo harías en una situación clínica real.
                    <br>
                    Para ello, necesitarás reunir la información médica correcta, considerar diagnósticos
                    alternativos y llegar al diagnóstico adecuado mediante pruebas rápidas, estudios de laboratorio
                    y de imagen. Es importante que realices intervenciones que estabilicen al paciente y le brinden
                    un tratamiento definitivo. Si es necesario, deberás consultar con otros especialistas y luego
                    decidir el nivel adecuado de atención para el paciente.
                    <br>
                    Serás evaluado tanto por las acciones que realices como por las que omitas. No tomar medidas
                    esenciales o realizar acciones innecesarias o dañinas afectará tu puntuación final. ¡Buena
                    suerte!
                </p>
            </TabPanel>
            <TabPanel header="Paciente">
                <p class="line-height-3 m-0 text-justify">
                    Primero, abre la pestaña del paciente y revisa toda la información que ya tenemos sobre él. Esto
                    te proporcionará las primeras pistas clave para el diagnóstico.
                </p>
            </TabPanel>
            <TabPanel header="Examen">
                <p class="line-height-3 m-0 text-justify">
                    A continuación, abre la pestaña de examen. Coloca el monitor cardíaco para ver los signos
                    vitales actuales del paciente.
                    <br>
                    Ahora deberías realizar un examen físico enfocado, seleccionando todas las pruebas relevantes
                    según las circunstancias.
                    <br>
                    No te distraigas con detalles innecesarios: examinar todo es ineficiente y algunos exámenes
                    serán innecesarios.
                </p>
            </TabPanel>
            <TabPanel header="Estabilizar">
                <p class="line-height-3 m-0 text-justify">
                    La pestaña de estabilización te permite realizar rápidamente algunas de las acciones más
                    críticas para estabilizar a un paciente inestable, incluyendo la intubación. Los signos vitales
                    son cruciales: ¡actuar sobre ellos de manera temprana es esencial!
                    <br>
                </p>
            </TabPanel>
            <TabPanel header="Diagnostico Diferencial">
                <p class="line-height-3 m-0 text-justify">
                    A estas alturas, deberías tener en mente algunos diagnósticos posibles para el paciente. Abre la
                    pestaña de diagnóstico diferencial y selecciona aquellos que puedan ser razonablemente
                    aplicables al paciente. Normalmente, la lista debería incluir de 3 a 5 diagnósticos potenciales.
                    Full Code incluye un conjunto de todos los diagnósticos posibles, derivados del modelo ABEM EM,
                    adaptados a cada caso para incluir los más relevantes según el sistema orgánico.
                    <br>
                    Una de tus selecciones en la pestaña de diagnóstico diferencial será, con suerte, tu diagnóstico
                    final, el cual elegirás en la pestaña de entrega del paciente.
                </p>
            </TabPanel>
            <TabPanel header="Investigar">
                <p class="line-height-3 m-0 text-justify">
                    En la pestaña de investigación, puedes seleccionar todas las pruebas al lado de la cama,
                    laboratorios y estudios de imagen que te ayudarán a reducir tu diagnóstico diferencial y llegar
                    a un diagnóstico final.
                    <br>
                    Selecciona todas las investigaciones relevantes los resultados aparecerán
                    abajo tan pronto como estén listos. Ten cuidado de no solicitar pruebas en exceso, ya que serás
                    penalizado por ello.
                    <br>
                    Los resultados pueden ayudarte a reducir tu lista de diagnósticos, pero déjalos en tu lista para
                    que puedas obtener crédito por haberlos considerado al final del caso.
                </p>
            </TabPanel>
            <TabPanel header="Intervenir">
                <p class="line-height-3 m-0 text-justify">
                    En la pestaña de intervención es donde realmente comienzas a tratar al paciente de manera
                    definitiva. Elige los medicamentos y procedimientos correctos para estabilizar y tratar al
                    paciente.
                    <br>
                    Como en todas las pestañas, selecciona todas las intervenciones indicadas, pero no más de las
                    necesarias. Elige sabiamente, ya que muchos de los medicamentos y procedimientos aquí pueden ser
                    perjudiciales y bajar significativamente tu puntuación final si no están indicados.
                </p>
            </TabPanel>
            <TabPanel header="Consulta Externa">
                <p class="line-height-3 m-0 text-justify">
                    La pestaña de comunicación te ofrece una selección de especialistas con los que puedes consultar
                    sobre el paciente. En muchos casos, es importante contar con un especialista para ayudar en el
                    tratamiento.
                    <br>
                    Consultas innecesarias pueden desperdiciar tiempo, lo que afectará negativamente tu puntuación.
                </p>
            </TabPanel>
            <TabPanel header="Hand Off">
                <p class="line-height-3 m-0 text-justify">
                    En la pestaña de entrega, necesitarás determinar la disposición final del paciente y seleccionar
                    tu diagnóstico definitivo.
                    <br>
                    Ambos aspectos son críticos, y sin respuestas correctas, tu paciente y tu puntuación no tendrán
                    buenos resultados.
                    <br>
                    Una vez que entregues al paciente, el juego habrá terminado y se te presentará tu puntuación
                    junto con algunos consejos opcionales para mejorar en tu próximo intento.
                </p>
            </TabPanel>
            <TabPanel header="Recomendación Final">
                <p class="line-height-3 m-0 text-justify">
                    Las pestañas están presentadas en el orden más típico de una evaluación, pero NO es necesario
                    que sigas el orden sugerido por las pestañas. Siéntete libre de moverte entre ellas y tratar al
                    paciente en el mismo orden que lo harías en la vida real. ¡Seguir el orden correcto puede marcar
                    la diferencia en el resultado del paciente!
                    <br>
                    Ahora deberías estar listo para diagnosticar y tratar a este paciente.
                    Si tienes alguna pregunta, comentario o sugerencia, por favor haz clic en el enlace de FEEDBACK
                    en el menú principal de la aplicación.
                </p>
            </TabPanel>
        </TabView>


        <div class="grid pt-4">
            <div class="col md:col-9"></div>
            <div class="col md:col-3">
                <Button label="Ok" @click="closeDialog" />
            </div>
        </div>
    </Dialog>
</template>



<style scoped>
.gestion-title {
    font-size: 2em;
    font-weight: bold;
    color: #bb86fc;
}

.total-casos {
    font-size: 1.3em;
    font-weight: bold;
    color: #e0e0e0;
}

.info-data,
.case-data {
    font-size: 1em;
    color: #fff9e3;
}

.info-data-dialog {
    font-size: 1.2em;
    color: #cfcfcf;
}

.case-data {
    font-weight: normal;
    padding-bottom: 0.5em;
}

.info-data {
    font-weight: bold;
    padding-bottom: 0.3em;
}

.month-name {
    font-size: 1.1em;
    font-weight: bold;
    color: #bb86fc;
    margin-bottom: 0.3em;
}

.datos-paciente {
    font-size: 1.4em;
    font-weight: bold;
    color: #bb86fc;
    margin-bottom: 0.3em;
}

.data-section {
    padding: 2px 0;
    border-bottom: 1px solid #444;
    margin: 0 10px;
}

.data-section:last-child {
    border-bottom: none;
}

h5 {
    margin: 0;
    padding: 2px 0;
}

.data-text {
    font-size: 0.85em;
    color: #b0b0b0;
}

.card-mes:hover {
    background-color: #333;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.examen-titulo {
    color: #bb86fc;
}

.data-section-main {
    padding: 2px 0;
    border-bottom: 1px solid #444;
}
</style>