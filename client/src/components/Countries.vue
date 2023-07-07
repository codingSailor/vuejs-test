<template>
    <div>
        <h1>Country Details</h1>
        <div id="main-container">
            <div v-if="selected_country.index  != null" id="flag-container">
                <img :src="img_path + country_details.flag" alt="">
            </div>
            <div id="info-container">
                <select id="countries" v-model="selected_country" class="form-control select-cont"
                    @change="get_country(selected_country.index)">
                    <option placeholder="Select a country" v-for="(cont, index) in countries" :value="{ cont, index }" :key="index">{{ cont }}
                    </option>
                </select>
                <p>Country Name : <span>{{ country_details.name }}</span></p>
                <p>Continent : <span>{{ country_details.continent }}</span></p>
                <p>Rank : <span>{{ country_details.rank }}</span></p>
                <br>
                <br>
                <div id="form-container">
                    <p class="form-control">NEW COUNTRY FORM :</p>
                    <br>
                    <div>
                        <p>Name : <input v-model="name" type="text" minlength="3" maxlength="20" name="name" id="" placeholder="Country Name" :style="name_exist ? 'border: 2px solid red' : ''"><span
                                v-if="name_exist">Name Already Exists</span></p>
                        <p>Continent : <select v-model="selected_continent" class="form-control">
                                <option value disabled>Select contintent</option>
                                <option v-for="(cont, index) in continents_list" :value="cont" :key="index">{{ cont }}
                                </option>
                            </select></p>
                        <p>Country Rank : <input v-model="rank" type="number" min="1" max="100" name="rank" id="" placeholder="Country Rank" :style="rank_exist ? 'border: 2px solid red' : ''">
                            <span v-if="rank_exist">Rank Already Exists</span></p>
                        <p>Country Flag : <input type="file" id="files" accept="image/jpeg, image/png"
                                @change="upload_image_file" /> </p>
                        <br>
                        <div class="btn-center">
                            <p>{{ message }}</p>
                            <button @click="register" style="margin: 0 0 0 10px;">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import authservice from '@/services/authservice.js'

export default {
    data() {
        return {
            img_path: 'http://localhost:8081/',
            selected_country: {},
            country_details: {},
            countries: [],
            continents_list: [],
            name: "",
            continent: "",
            rank: null,
            file: null,
            selected_continent: null,
            new_image_file: null,
            new_image_type: '',
            image: null,
            name_exist: false,
            rank_exist: false,
            file_size_large: false,
            message: ''
        }
    },
    mounted() {
        this.load_countries();
        this.get_country(0)
    },
    methods: {
        async load_countries() {
            await authservice.countries().then((response) => {
                var keys = response.data.keys;
                for (var i = 0; i < keys.length; i++) {
                    if (!this.countries.includes(keys[i].name)) {
                        this.countries.push(keys[i].name)
                    }
                }
                for (var i = 0; i < keys.length; i++) {
                    if (!this.continents_list.includes(keys[i].continent)) {
                        this.continents_list.push(keys[i].continent)
                    }
                }
            }).catch((e) => {
                    console.error(e);
                })
        },
        async get_country(val) {
            await authservice.country_id({
                country_id: val
            }).then((response) => {
                // if api work
                this.country_details = response.data.country;
                this.selected_country.cont = this.country_details.name;
                this.selected_country.index = val;
                return true
            }).catch((e) => {
                // if the api doesn't work
                console.error(e);
            })
        },
        async register() {
            this.rank_exist = false;
            this.name_exist = false;
            this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
            if (this.name.length < 3 || this.name.length > 20) {
                alert("Country name should be in range of 3 to 20 characters")
            } else if (this.selected_continent == null) {
                alert("Select a Coninent")
            } else if (this.rank == null) {
                alert("Select a Rank")
            }  else if (this.new_image_file == null) {
                return this.message = "Select a file"
            } else if (this.file_size_large) {
                alert("File size greater than in 4mb")
            } else {
                await authservice.country({
                name: this.name,
                continent: this.selected_continent,
                rank: this.rank,
                new_image_file: this.new_image_file,
                new_image_name: this.name,
                new_image_type: this.new_image_type
                // file: this.file
                }).then((response) => {
                    if (response.data.status == 'error') {
                        if (response.data.message == "Rank Already Exists") { this.rank_exist = true }
                        if (response.data.message == "Name Already Exists") { this.name_exist = true }
                    } else {
                        this.message = response.data.message;
                        this.load_countries();
                    }
                }).catch((e) => {
                    // if the api doesn't work
                    console.error(e);
                })
            }
        },
        upload_image_file(event) {
            this.files = event.target.files[0];
            this.new_image_type = event.target.files[0].type;

            const reader = new FileReader()
            reader.readAsDataURL(this.files)
            reader.onload = e => {
                this.new_image_file = e.target.result;
            }
            if (event.target.files[0].size > 4000000) {
                this.file_size_large = true;
            }else {
                this.file_size_large = false;
                this.new_image_name = event.target.files[0].name;
            }
        }
    }
}
</script>

<style scoped>
* {
    box-sizing: border-box;
}

body {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 15px;
    color: #333;
    background-color: #eee;
}

h1 {
    text-align: center;
}

#main-container {
    width: 502px;
    margin: 30px auto;
    padding: 0;
}

#flag-container {
    height: 252px;
    background-color: #fff;
    border: 1px solid #333;
}

#flag-container img {
    display: block;
    width: 100%;
    height: 100%;
}

#info-container but {
    display: block;
    margin: 20px auto;
    padding: 5px;
    min-width: 100%;
    color: #333;
    font-size: 15px;
    font-weight: 900;
    text-align-last: center;
}

.new-cont {
    color: #333;
    font-size: 15px;
    font-weight: 900;
    text-align-last: center;
}

.select-cont {
    display: block;
    margin: 20px auto;
    padding: 5px;
    min-width: 100%;
    color: #333;
    font-size: 15px;
    font-weight: 900;
    text-align-last: center;
}

.btn-center {
    display: grid;
    justify-content: center;
    align-items: center;
}
#info-container p {
    padding: 0 10px;
    font-weight: 600;
}

#info-container p span {
    font-weight: normal;
}

#form-container p span {
    font-size: smaller;
    font-weight: 200;
    color: red;
    margin-left: 10px;
}

@media (max-width: 768px) {
    body {
        font-size: 12px;
    }

    #main-container {
        width: 342px;
    }

    #flag-container {
        height: 172px;
    }

    #info-container select {
        font-size: 12px;
        font-weight: 600;
    }
}
</style>