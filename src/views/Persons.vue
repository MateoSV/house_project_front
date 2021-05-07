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
            Nuevo Interes
            <v-icon dark>
              mdi-plus
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="data.length" class="d-flex mx-8">
        <v-col cols="12">
          <v-data-table
              :headers="headers"
              :items="data"
              class="elevation-1"
          >
            <template v-slot:item.appointment_date="{ item }">
              <v-chip
                  :color="getColor(item.appointment_date)"
                  dark
              >
                {{ item.appointment_date }}
              </v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon
                  small
                  class="mr-2"
                  @click="viewItem(item)"
              >
                mdi-information-outline
              </v-icon>
              <v-icon
                  small
                  class="mr-2"
                  @click="editItem(item)"
              >
                mdi-file-edit-outline
              </v-icon>
              <v-icon
                  small
                  class="mr-2"
                  @click="deleteItem(item)"
              >
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
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
            <v-toolbar-title>Nuevo Interes sobre proyecto</v-toolbar-title>
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
            <v-subheader>Agregar interes sobre proyecto</v-subheader>
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
                    label="Documento"
                    :rules="rules.document_rules"
                    hide-details="auto"
                    v-model="document"
                    @blur="resetValid"
                ></v-text-field>
              </v-list-item>
              <v-list-item>
                <v-text-field
                    label="Nombre"
                    :rules="rules.required_rules"
                    hide-details="auto"
                    v-model="name"
                    @blur="resetValid"
                ></v-text-field>
              </v-list-item>
              <v-list-item>
                <v-text-field
                    label="Correo electronico"
                    hide-details="auto"
                    v-model="email"
                    :rules="rules.email_rules"
                    @blur="resetValid"
                ></v-text-field>
              </v-list-item>
              <v-list-item>
                <v-text-field
                    label="Telefono"
                    hide-details="auto"
                    v-model="phone"
                    :rules="rules.required_rules"
                    @blur="resetValid"
                ></v-text-field>
              </v-list-item>
              <v-list-item>
                <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="appointment_date"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="appointment_date"
                        label="Fecha de la visita"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="rules.required_rules"
                        @blur="resetValid"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                      v-model="appointment_date"
                      no-title
                      scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="primary"
                        @click="menu = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(appointment_date)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-list-item>
              <v-list-item>
                <v-autocomplete
                    v-model="selected_projects"
                    :loading="isLoading"
                    :items="items"
                    item-text="name"
                    item-value="id"
                    :search-input.sync="search"
                    class="mx-4"
                    hide-no-data
                    chips
                    clearable
                    hide-details
                    hide-selected
                    label="Proyectos de interes"
                    solo
                    multiple
                >
                  <template v-slot:selection="{ attr, on, item, selected }">
                    <v-chip
                        v-bind="attr"
                        :input-value="selected"
                        color="blue-grey"
                        class="white--text"
                        v-on="on"
                    >
                      <v-icon left>
                        mdi-home-city
                      </v-icon>
                      <span v-text="item.name"></span>
                    </v-chip>
                  </template>
                </v-autocomplete>
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
              {{ `${item_selected.name}` }}
            </v-card-title>
            <div class="my-6 mx-6">
              <p class="grey--text text-body-2"><span class="blue--text">Nombre: </span>{{ item_selected.name }}</p>
              <p class="grey--text text-body-2"><span class="blue--text">Documento: </span>{{ item_selected.document }}
              </p>
              <p class="grey--text text-body-2"><span class="blue--text">Telefono: </span>{{ item_selected.phone }}</p>
              <p class="grey--text text-body-2"><span
                  class="blue--text">Correo electronico: </span>{{ item_selected.email }}</p>
              <p class="grey--text text-body-2"><span
                  class="blue--text">Fecha de la cita: </span>{{ item_selected.appointment_date }}</p>
              <p class="grey--text text-body-2"><span class="blue--text">Proyectos de interes: </span></p>
              <v-row>
                <v-col cols="12">
                  <v-chip
                      color="primary"
                      class="white--text"
                      v-for="item in item_selected.houses"
                  >
                    <v-icon left>
                      mdi-home-city
                    </v-icon>
                    <span v-text="item.name"></span>
                  </v-chip>
                </v-col>
              </v-row>

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
  name: "Persons",
  data() {
    return {
      valid: true,
      data: [],
      loading: false,
      dialog: false,
      rules: {
        document_rules: [
          value => !!value || 'Requerido.',
          value => (value && Number.isInteger(parseInt(value))) || 'Debe ser un numero',
        ],
        required_rules: [
          value => !!value || 'Requerido.',
        ],
        email_rules: [
          value => !!value || 'Requerido.',
          value => /.+@.+\..+/.test(value) || 'E-mail debe ser valido',
        ],
      },
      document: null,
      email: null,
      name: null,
      phone: null,
      appointment_date: null,
      menu: false,
      id: null,
      index: null,
      valid_form: false,
      dialog_load: false,
      message: null,
      dialog_detail: false,
      item_selected: null,
      selected_projects: null,
      isLoading: false,
      items: [],
      search: null,
      headers: [
        {
          text: 'Nombre',
          align: 'start',
          value: 'name',
        },
        {text: 'Documento', value: 'document'},
        {text: 'Fecha', value: 'appointment_date'},
        {text: 'Acciones', value: 'actions'},
      ],
    }
  },
  mounted() {
    this.loadData()
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val)
    },
  },
  methods: {
    querySelections(v) {
      this.loading = true

      const url = `http://localhost:8000/api/houses`
      this.$axios.get(url)
          .then(({data}) => {
            this.items = data.filter(e => {
              return (e.name || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
            })
            this.loading = false
          })
          .catch((error) => {
            this.loading = false
            console.log('error ' + error)
          })
    },
    resetValid() {
      this.valid_form = false
    },
    loadData() {
      this.loading = true

      const url = `http://localhost:8000/api/persons`
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
        document: this.document,
        email: this.email,
        name: this.name,
        phone: this.phone,
        appointment_date: this.appointment_date,
        houses: this.selected_projects
      }

      let config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      const url = `http://localhost:8000/api/persons`
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
    editItem(item) {
      this.clearData()

      const arr = item.houses.map(o => o.id);

      this.document = item.document.toString()
      this.email = item.email
      this.name = item.name
      this.phone = item.phone
      this.appointment_date = item.appointment_date
      this.selected_projects = arr
      this.id = item.id
      this.dialog = true
      this.items = item.houses
    },
    updateItem() {
      if (!this.$refs.form.validate()) {
        this.valid_form = true
        this.message = 'Datos invalidos'
        return
      }
      this.dialog_load = true

      const body = {
        document: this.document,
        email: this.email,
        name: this.name,
        phone: this.phone,
        appointment_date: this.appointment_date,
        houses: this.selected_projects
      }

      let config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      const url = `http://localhost:8000/api/persons/${this.id}`
      this.$axios.put(url, JSON.stringify(body), config)
          .then(({data}) => {
            this.loadData()
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
    deleteItem(item) {
      this.loading = true
      const url = `http://localhost:8000/api/persons/${item.id}`
      this.$axios.delete(url)
          .then(({data}) => {
           this.loadData()
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
      this.document = null
      this.email = null
      this.name = null
      this.phone = null
      this.appointment_date = null
      this.selected_projects = null
      this.id = null
      this.index = null
    },
    getColor(appointment_date) {
      if (appointment_date > '2021-05-15') return 'red'
      else if (appointment_date > '2021-05-01') return 'orange'
      else return 'green'
    },
  }
}
</script>