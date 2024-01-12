<template>
  <div id="app">
    <div id="loading-screen" class="d-flex justify-content-center align-items-center" :class="{ 'is-loaded': isLoaded }">
      <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Display Word Cloud -->
    <div class="container-fluid">
      <div class="logo">
        <img src="/images/tpbs-election66-full.png" alt="Thai PBS Logo" />
      </div>
      <div class="header">
        <h1 class="title">ขอ 1 คำที่คุณอยากแก้ไขด้าน 
          <span class="underlined underline-mask topic">"สวัสดิการ"</span>
        </h1>
      </div>
      <div class="cloud-area">
        <div class="cloud-area-container">
          <vue-word-cloud
            style="width: 100%; height: 70vh;"
            :words="words"
            :font-family="'DB Helvethaica X'"
            :color="([, weight]) => weight > 15 ? '#333332' : weight > 10 ? '#E95B39' : weight > 0 ? '#595958' : '#ffffff'"
            :spacing="spacing"
            :font-size-ratio="ratio">
          </vue-word-cloud>
        </div>
      </div>
    </div>

    <!-- 
    <video autoplay muted loop id="myVideo">
      <source src="/videos/1.mp4" type="video/mp4">
    </video>
    -->
  </div>
</template>

<script>
import axios from 'axios'
import VueWordCloud from 'vuewordcloud';
import { Modal } from 'bootstrap'
import LoadingScreen from './LoadingScreen.vue';

export default {
  name: "TagCloudDarkTheme",
  components: {
    VueWordCloud,
    LoadingScreen,
  },
  data() {
    return {
      words: undefined,
      data: null,
      spacing: 1,
      ratio: 10,
      enterAnimation: ['animated','bounceIn'],
      text: null,
      textError: false,
      gender: null,
      genderError: false,
      generation: null,
      generationError: false,
      fullname: null,
      phone: null,
      isLoaded: false,
      wordModal: null,
      profileModal: null,
      personModal: null,
      noticeModal: null,
      dataSending: false,
      sendSuccess: false
    }
  },
  async created() {
    let arr = []
    await axios
        .get('https://asia-southeast1-thai-pbs-special-project.cloudfunctions.net/wordcloudMayor/overview')
        .then(response => (
            response.data.forEach(item => {
              arr.push([item.word, item.count])
            })
        )).finally(() => {
          this.isLoaded = true
        })
    this.words = arr
  },
  methods: {
    nextModal() {
      this.textError = !this.text;

      this.genderError = !this.gender;

      this.generationError = !this.generation;

      if (this.textError || this.genderError || this.generationError) {
        return false
      } else {
        this.personModal.show()
        this.wordModal.hide()
      }
    },
    sendData() {
      this.dataSending = true

      let data = JSON.stringify({
        "data": this.text,
        "gender": this.gender,
        "generation": this.generation,
        "fullname": this.fullname,
        "phone": this.phone
      });

      console.log(data)

      let config = {
        method: 'post',
        url: 'https://asia-southeast1-thai-pbs-special-project.cloudfunctions.net/wordcloudMayor/submit',
        headers: {
          'Content-Type': 'application/json'
        },
        data : data
      };

      // this.personModal.hide()
      // this.profileModal.show()

      axios(config)
          .then((response) => {
            console.log(response.data);
          })
          .finally(() => {
            this.text = ''
            this.region = ''
            this.generation = ''
            this.fullname = ''
            this.phone = ''
            // this.personModal.hide()
            this.sendSuccess = true

            setTimeout(() => {
              window.location.reload();
            }, 3000);
          })
          .catch((error) => {
            console.log(error);
          });

    }
  },
  mounted() {
    this.wordModal = new Modal(document.getElementById('questionModal'));
    this.profileModal = new Modal(document.getElementById('profileModal'));
    this.personModal = new Modal(document.getElementById('personModal'));
  }
}
</script>

<style scoped lang="scss">

#app {
  height: 100vh;
  overflow: hidden;
  position: relative;
}

/* LOADING SCREEN */
#loading-screen {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 99;

  &.is-loaded {
    opacity: 0;
    overflow: hidden;
    height: 0;
    width: 0;
  }
}

.container-fluid {
  width: 100vw;
  height: 100vh;

  padding-top: 32px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  h1 {
    font-size: 48px;
    color: white;
    background: #333332;
    padding: 8px 32px 0;
    line-height: 1;
  }

  .topic {
    color: white;
    font-weight: bold;
    font-size: 64px;
  }
}

.cloud-area {
  width: 100%;
  height: calc(100vh - 150px);
  padding: 64px 80px 0;
}

.cloud-area-container {
  // background: rgba(255, 255, 255, 0.2);
  background: #f1d8d2;
  border-radius: 12px;
  padding-top: 32px;
}


.underlined {
/*   background: red; */
  position: relative;
}

.underline-mask:after {
  content: '';
  position: absolute;
  top: 80%;
  width: 150%;
  aspect-ratio: 3 / 1;
  left: 50%;
  transform: translate(-50%, 0);
  border-radius: 50%;
  border: 6px solid white;
  /* Use a conic gradient mask to hide and show the bits you want */
  --spread: 140deg;
  --start: 290deg;
  mask: conic-gradient(from var(--start), white 0 var(--spread), transparent var(--spread));
}


video {
  position: absolute;
  top:0;
  left:0; 
  right: 0;
  bottom: 0;
  width: 100vw;

  z-index: -1;
}

.logo {
  position: absolute;
  top: 32px;
  right: 32px;
  width: 150px;

  > img {
    max-width: 100%;
  }
}
</style>