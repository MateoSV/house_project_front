<template>
  <div>
    <div v-if="loading">
      <v-container>
        <v-row>
          <v-col
              cols="12"
              md="4"
          >
            <v-skeleton-loader
                class="mx-auto"
                max-width="300"
                type="card"
            ></v-skeleton-loader>
          </v-col>
          <v-col
              cols="12"
              md="4"
          >
            <v-skeleton-loader
                class="mx-auto"
                max-width="300"
                type="card"
            ></v-skeleton-loader>
          </v-col>
          <v-col
              cols="12"
              md="4"
          >
            <v-skeleton-loader
                class="mx-auto"
                max-width="300"
                type="card"
            ></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-else>
      <v-row>
        <v-col cols="12" class="my-4">
          <v-btn
              class="mx-2"
              dark
              small
              color="primary"
              @click="dialog = true; clearData()"
          >
            Nuevo Proyecto
            <v-icon dark>
              mdi-plus
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <div v-if="data.length" class="d-flex">
        <v-col cols="12" md="4" :key="index" v-for="(item, index) in data" class="px-4 py-4">
          <v-card shadow="always">
            <v-menu>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    dark
                    icon
                    v-bind="attrs"
                    v-on="on"
                    color="primary"
                    absolute
                    right
                    offset-y
                >
                  Menu
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item link>
                  <v-list-item-title @click="viewItem(item)">Ver</v-list-item-title>
                </v-list-item>
                <v-list-item link>
                  <v-list-item-title @click="editItem(item, index)">Editar</v-list-item-title>
                </v-list-item>
                <v-list-item link>
                  <v-list-item-title @click="deleteItem(item, index)">Eliminar</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <div class="d-flex py-2 pr-2">
              <v-col cols="3" class="d-flex flex-column justify-center mx-6 text-center align-center">
                <v-icon x-large color="primary">{{ getIcon(item.name) }}</v-icon>
                <p class="blue--text text-h4 font-weight-black">{{ item.code }}</p>
              </v-col>
              <v-divider
                  vertical
              ></v-divider>
              <v-col cols="9" class="mx-4 my-4">
                <p class="blue--text text-subtitle-1">{{ item.name }}</p>
                <p class="grey--text text-caption">{{ item.address }}</p>
                <p class="grey--text text-caption">{{ item.company }}</p>
              </v-col>
            </div>
          </v-card>
        </v-col>
      </div>
      <div v-else class="col-12">
        <v-row>
          <v-col cols="12" class="d-flex justify-center">
            <div>
              <v-img height="500" src="@/assets/empty_state.jpg"/>
              <div class="text-center">No hay datos existentes</div>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
    <v-row justify="center">
      <v-dialog
          v-model="dialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar
              dark
              color="primary"
          >
            <v-btn
                icon
                dark
                @click="dialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Nuevo Proyecto</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                  v-if="id"
                  dark
                  text
                  @click="updateItem()"
              >
                Actualizar
              </v-btn>
              <v-btn
                  v-else
                  dark
                  text
                  @click="saveProject()"
              >
                Guardar
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-list
              three-line
              subheader
          >
            <v-alert
                text
                prominent
                type="error"
                icon="mdi-cloud-alert"
                v-if="valid_form"
            >
              {{ message }}
            </v-alert>
            <v-subheader>Creación de un nuevo proyecto inmobiliario</v-subheader>
          </v-list>
          <v-divider></v-divider>
          <v-list
              three-line
              subheader
              class="mx-auto"
          >
            <v-form
                ref="form"
                v-model="valid"
                lazy-validation
            >
              <v-list-item>
                <v-text-field
                    label="Codigo del proyecto"
                    :rules="rules.code_rules"
                    hide-details="auto"
                    v-model="code"
                    @blur="resetValid"
                ></v-text-field>
              </v-list-item>
              <v-list-item>
                <v-text-field
                    label="Nombre del proyecto"
                    :rules="rules.required_rules"
                    hide-details="auto"
                    v-model="name"
                    @blur="resetValid"
                ></v-text-field>
              </v-list-item>
              <v-list-item>
                <v-text-field
                    label="Direccion del proyecto"
                    hide-details="auto"
                    v-model="address"
                    @blur="resetValid"
                ></v-text-field>
              </v-list-item>
              <v-list-item>
                <v-text-field
                    label="Constructora del proyecto"
                    hide-details="auto"
                    v-model="company"
                    :rules="rules.required_rules"
                    @blur="resetValid"
                ></v-text-field>
              </v-list-item>
              <v-list-item>
                <v-text-field
                    label="Contacto del proyecto"
                    hide-details="auto"
                    v-model="contact"
                    @blur="resetValid"
                ></v-text-field>
              </v-list-item>
            </v-form>
          </v-list>
        </v-card>
        <v-dialog
            v-model="dialog_load"
            hide-overlay
            persistent
            width="300"
        >
          <v-card
              color="primary"
              dark
          >
            <v-card-text>
              Cargando
              <v-progress-linear
                  indeterminate
                  color="white"
                  class="mb-0"
              ></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-dialog>
      <div v-if="item_selected">
        <v-dialog
            v-model="dialog_detail"
            width="500"
        >
          <v-card>
            <v-card-title class="headline primary white--text">
              {{ `${item_selected.code} - ${item_selected.name.substr(0, 60)}...` }}
            </v-card-title>
            <div class="my-6 mx-6">
              <p class="grey--text text-body-2"><span class="blue--text">Codigo: </span>{{ item_selected.code }}</p>
              <p class="grey--text text-body-2"><span class="blue--text">Nombre: </span>{{ item_selected.name }}</p>
              <p class="grey--text text-body-2"><span class="blue--text">Direccion: </span>{{ item_selected.address }}
              </p>
              <p class="grey--text text-body-2"><span class="blue--text">Constructora: </span>{{
                  item_selected.company
                }}</p>
              <p class="grey--text text-body-2"><span class="blue--text">Contacto: </span>{{ item_selected.contact }}
              </p>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  depressed
                  color="primary"
                  @click="dialog_detail = false"
              >
                Cerrar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Houses",
  data() {
    return {
      valid: true,
      data: [],
      loading: false,
      dialog: false,
      rules: {
        code_rules: [
          value => !!value || 'Requerido.',
          value => (value && value.length >= 3) || 'Minimo 3 caracteres',
          value => (value && Number.isInteger(parseInt(value))) || 'Debe ser un numero',
        ],
        required_rules: [
          value => !!value || 'Requerido.',
        ]
      },
      code: null,
      address: null,
      name: null,
      company: null,
      contact: null,
      id: null,
      index: null,
      valid_form: false,
      dialog_load: false,
      message: null,
      dialog_detail: false,
      item_selected: null
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    resetValid() {
      this.valid_form = false
    },
    loadData() {
      this.loading = true

      const url = `http://localhost:8000/api/houses`
      this.data = []
      this.$axios.get(url)
          .then(({data}) => {
            this.data = data
            this.loading = false
          })
          .catch((error) => {
            this.loading = false
            console.log('error ' + error)
          })
    },
    saveProject() {
      if (!this.$refs.form.validate()) {
        this.valid_form = true
        this.message = 'Datos invalidos'
        return
      }
      this.dialog_load = true

      const body = {
        code: this.code,
        address: this.address,
        name: this.name,
        company: this.company,
        contact: this.contact,
      }

      let config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      const url = `http://localhost:8000/api/houses`
      this.$axios.post(url, JSON.stringify(body), config)
          .then(({data}) => {
            this.data.push(data)
            this.dialog_load = false
            this.dialog = false
          })
          .catch((error) => {
            if (error.response) {
              this.message = error.response.data
              this.valid_form = true
              this.dialog_load = false
            } else {
              this.message = error
              this.dialog_load = false
            }
          })
    },
    viewItem(item) {
      this.item_selected = item
      this.dialog_detail = true
    },
    editItem(item, index) {
      this.clearData()
      this.code = item.code.toString()
      this.address = item.address
      this.name = item.name
      this.company = item.company
      this.contact = item.contact
      this.id = item.id
      this.index = index
      this.dialog = true
    },
    updateItem() {
      if (!this.$refs.form.validate()) {
        this.valid_form = true
        this.message = 'Datos invalidos'
        return
      }
      this.dialog_load = true

      const body = {
        code: this.code,
        address: this.address,
        name: this.name,
        company: this.company,
        contact: this.contact,
      }

      let config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      const url = `http://localhost:8000/api/houses/${this.id}`
      this.$axios.put(url, JSON.stringify(body), config)
          .then(({data}) => {
            this.data[this.index] = data
            this.dialog_load = false
            this.dialog = false
          })
          .catch((error) => {
            if (error.response) {
              this.message = error.response.data
              this.valid_form = true
              this.dialog_load = false
            } else {
              this.message = error
              this.dialog_load = false
            }
          })
    },
    deleteItem(item, index) {
      this.loading = true
      const url = `http://localhost:8000/api/houses/${item.id}`
      this.$axios.delete(url)
          .then(({data}) => {
            this.data.splice(index, 1)
            this.loading = false
          })
          .catch((error) => {
            if (error.response) {
              this.loading = false
            } else {
              this.loading = false
            }
          })
    },
    getIcon(name) {
      if (name.includes('Edificio') || name.includes('Torre')) {
        return 'mdi-office-building'
      }

      if (name.includes('Urbanizacion') || name.includes('Unidad') || name.includes('Conjunto')) {
        return 'mdi-home-city'
      }

      return 'mdi-home-group'
    },
    clearData() {
      this.code = null
      this.address = null
      this.name = null
      this.company = null
      this.contact = null
      this.id = null
      this.index = null
    }
  }
}
</script>
