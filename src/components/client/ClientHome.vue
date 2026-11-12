<script setup>
import { computed, ref } from "vue";
import { useClinic } from "../../stores/clinic";
import { useUi } from "../../stores/ui";
import { dnum, mon, fmt, shortDate, greeting } from "../../lib/dates";
import { filesText } from "../../lib/format";
import { vax } from "../../lib/vaccines";
import StatusPill from "../shared/StatusPill.vue";

const clinic = useClinic();
const ui = useUi();
const confirmId = ref(null);

const upcoming = computed(() =>
  clinic.myAppts.filter((a) =>
    ["pending", "confirmed", "live"].includes(a.status),
  ),
);
const past = computed(() =>
  clinic.myAppts
    .filter((a) => a.status === "done" || a.status === "cancelled")
    .reverse()
    .slice(0, 4),
);
const summary = computed(() => {
  const next = upcoming.value[0];
  return next
    ? `Tu próxima cita es con ${clinic.petName(next.petId)}, ${fmt(next.date)} a las ${next.time}.`
    : "No tienes citas próximas.";
});

const canJoin = (a) =>
  a.mode === "tele" && (a.status === "confirmed" || a.status === "live");

function cancel(a) {
  ui.notify(clinic.setStatus(a.id, "cancelled"));
  confirmId.value = null;
}
</script>

<template>
  <section>
    <div class="head">
      <div>
        <h1>{{ greeting() }}, Ana</h1>
        <p>{{ summary }}</p>
      </div>
      <button class="btn primary" type="button" @click="ui.go('book')">
        Agendar cita
      </button>
    </div>

    <div class="grid2">
      <div class="panel">
        <h2>Próximas citas</h2>
        <p v-if="!upcoming.length" class="empty">
          No tienes citas próximas. Agenda una desde el botón de arriba.
        </p>
        <ul v-else class="appts" style="margin-top: 14px">
          <li
            v-for="a in upcoming"
            :key="a.id"
            class="appt"
            :class="{ urgent: a.urgency === 'urgent' }"
          >
            <div class="when">
              <strong>{{ dnum(a.date) }}</strong
              ><span>{{ mon(a.date) }}</span>
            </div>
            <div class="what">
              <div class="line1">
                <span class="time">{{ a.time }}</span>
                <b>{{ clinic.petName(a.petId) }}</b>
                <StatusPill :status="a.status" />
              </div>
              <p>{{ a.reason }}</p>
              <p class="meta">
                {{ clinic.vetName(a.vetId) }} ·
                {{ a.mode === "tele" ? "Videoconsulta" : "En la clínica"
                }}{{ filesText(a) ? " · " + filesText(a) : "" }}
              </p>
            </div>
            <div class="acts">
              <button
                v-if="canJoin(a)"
                class="btn primary"
                type="button"
                @click="ui.openConsult(a)"
              >
                {{
                  a.status === "live"
                    ? "Entrar a la sala"
                    : "Ir a la sala de espera"
                }}
              </button>
              <template
                v-if="a.status === 'pending' || a.status === 'confirmed'"
              >
                <button
                  v-if="confirmId !== a.id"
                  class="btn ghost"
                  type="button"
                  @click="ui.startReschedule(a.id)"
                >
                  Reprogramar
                </button>
                <button
                  v-if="confirmId !== a.id"
                  class="btn ghost"
                  type="button"
                  @click="confirmId = a.id"
                >
                  Cancelar
                </button>
                <span v-else class="inline-confirm">
                  ¿Cancelar la cita?
                  <button class="btn danger" type="button" @click="cancel(a)">
                    Sí, cancelar
                  </button>
                  <button
                    class="btn ghost"
                    type="button"
                    @click="confirmId = null"
                  >
                    No
                  </button>
                </span>
              </template>
            </div>
          </li>
        </ul>

        <template v-if="past.length">
          <h2 style="margin-top: 22px">Anteriores</h2>
          <ul class="appts" style="margin-top: 12px">
            <li v-for="a in past" :key="a.id" class="appt">
              <div class="when">
                <strong>{{ dnum(a.date) }}</strong
                ><span>{{ mon(a.date) }}</span>
              </div>
              <div class="what">
                <div class="line1">
                  <span class="time">{{ a.time }}</span>
                  <b>{{ clinic.petName(a.petId) }}</b>
                  <StatusPill :status="a.status" />
                </div>
                <p>{{ a.reason }}</p>
                <p v-if="a.result" class="dx">
                  <b>Diagnóstico:</b> {{ a.result.dx }}
                </p>
              </div>
            </li>
          </ul>
        </template>
      </div>

      <div class="panel">
        <h2>Vacunas</h2>
        <ul class="vax" style="margin-top: 14px">
          <li v-for="p in clinic.myPets" :key="p.id">
            <h3>{{ p.name }}</h3>
            <ul>
              <li v-for="v in p.vaccines" :key="v.name" class="v">
                <span
                  >{{ v.name }}
                  <span class="nx">{{ shortDate(v.next) }}</span></span
                >
                <span class="pill" :class="'v-' + vax(v).key">{{
                  vax(v).label
                }}</span>
              </li>
              <li v-if="!p.vaccines.length" class="meta">
                Sin vacunas registradas.
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
