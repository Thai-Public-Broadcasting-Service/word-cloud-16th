<template>
  <div id="app">
    <div id="loading-screen" class="d-flex justify-content-center align-items-center" :class="{ 'is-loaded': isLoaded }">
      <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="bg-overlay" />

    <!-- Display Word Cloud -->
    <div class="container-fluid">
      <div 
        class="header"
        :class="{ embed: query.type === 'embed'}"
        v-motion
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            type: 'spring',
            stiffness: '100',
            delay: 100,
          },
        }"      
      >
      <button type="button" class="btn-question" data-bs-toggle="modal" data-bs-target="#questionModal">
        ร่วมส่งคำอวยพร และให้กำลังใจไทยพีบีเอส
      </button>
      </div>
      <div class="cloud-area"
        v-motion
        :initial="{
          opacity: 0.5,
        }"
        :enter="{
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: '200',
          },
        }"      
        >
        <!-- :color="([, weight]) => weight > 15 ? '#E95B39' : weight > 10 ? '#BEA69F' : weight > 0 ? '#CCCACA' : '#9A4312'" -->
        <vue-word-cloud
          style="width: 100%; height: calc(90vh - 220px)"
          :words="words"
          :font-family="'DB Helvethaica X'"
          :color="([, weight]) => weight > 15 ? '#E95B39' : weight > 10 ? '#7b7b7b' : weight > 0 ? '#5c5c5c' : '#9A4312'"
          :spacing="spacing"
          :font-size-ratio="ratio">
        </vue-word-cloud>      
      </div>    
    </div>
    <!-- Question Modal -->
    <div class="modal fade" id="questionModal" tabindex="-1" aria-labelledby="questionModal" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog">
        <div class="modal-content">
          <button type="button" class="btn-modal-close" data-bs-dismiss="modal"><i class="bi bi-x-lg"></i></button>
          <div class="modal-body p-4">
            <div class="row g-3">
              <div class="col-md-12">
                <label for="your-voice" class="form-label">ร่วมส่งคำอวยพร และให้กำลังใจไทยพีบีเอส</label>
                <input class="form-control" id="your-voice" rows="2" v-model="text" />
                <p class="text-danger" v-show="textError">โปรดระบุคำ/ข้อความ</p>
              </div>
              <div class="col-12">
                <label class="form-label">เพศของคุณ</label>
                <br/>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="gender" id="male" value="male" v-model="gender">
                  <label class="form-check-label" for="male">ชาย</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="gender" id="female" value="female" v-model="gender">
                  <label class="form-check-label" for="female">หญิง</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="gender" id="other" value="other" v-model="gender">
                  <label class="form-check-label" for="other">อื่น ๆ </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="gender" id="not-specified" value="not-specified" v-model="gender">
                  <label class="form-check-label" for="other">ไม่ระบุ</label>
                </div>
                <p class="text-danger" v-show="genderError">โปรดเลือกเพศของคุณ</p>
              </div>
              <div class="col-12">
                <label class="form-label">ช่วงอายุของคุณ</label>
                <br/>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="generation" id="gen-z" value="gen-z" v-model="generation">
                  <label class="form-check-label" for="gen-z">น้อยกว่า 26 ปี</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="generation" id="gen-y" value="gen-y" v-model="generation">
                  <label class="form-check-label" for="gen-y">26 - 42 ปี</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="generation" id="gen-x" value="gen-x" v-model="generation">
                  <label class="form-check-label" for="gen-x">43 - 58 ปี</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="generation" id="baby-boomer" value="baby-boomer" v-model="generation">
                  <label class="form-check-label" for="baby-boomer">59 ปีขึ้นไป</label>
                </div>
                <p class="text-danger" v-show="generationError">โปรดเลือกช่วงอายุของคุณ</p>
              </div>
              <div class="col-12 text-center">
                <button class="btn-submit" type="submit" @click="nextModal()">ร่วมส่งคำอวยพร</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Personal Info Modal -->
    <div class="modal fade" id="personModal" tabindex="-1" aria-labelledby="personModal" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog">
        <div class="modal-content">
          <button type="button" class="btn-modal-close" data-bs-dismiss="modal"><i class="bi bi-x-lg"></i></button>
          <div class="modal-body p-4">
            <div class="row g-3">
              <div class="col-12 text-center">
                <h4>ขอบคุณที่ร่วมกิจกรรม</h4>
                <h1 class="fw-bold">"{{currentSubject.title}}" </h1>
              </div>
              <div class="col-12 text-center">
                <button class="btn-submit" type="submit" @click="sendData()" :disabled="dataSending">
                  <span v-if="!dataSending">ตกลง</span>
                  <span v-else>
                      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span class="visually-hidden">Loading...</span>
                  </span>
                </button>
              </div>
              <div class="col-12 text-center" v-show="sendSuccess">
                <label style="font-size: 20px; font-weight: 500" class="text-success">ส่งข้อมูลสำเร็จ!</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import VueWordCloud from 'vuewordcloud';
import { Modal } from 'bootstrap'
import LoadingScreen from './LoadingScreen.vue';

export default {
  name: "TagCloud",
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
      sendSuccess: false,
      query: {},
      subjectList: [
        {
          id: 1,
          key: '16th',
          title: 'ร่วมส่งคำอวยพร และให้กำลังใจไทยพีบีเอส',
          path: '16th',
        }, 
      ],
      currentSubject: {
        id: 1,
        key: '16th',
        title: 'ร่วมส่งคำอวยพร และให้กำลังใจไทยพีบีเอส',
        path: '16th',        
      },
    }
  },
  async created() {
    this.query = qs.parse(window.location?.search, { ignoreQueryPrefix: true });
    this.currentSubject = this.getCurrentSubject(this.query.subject);

    let arr = []
    await axios
      .get(`https://asia-southeast1-thai-pbs-special-project.cloudfunctions.net/wordcloud-generic/topics/${this.currentSubject.path}/overview`)
      .then(response => (
          response.data.forEach(item => {
            arr.push([item.word, item.count])
          })
      )).finally(() => {
        this.isLoaded = true
      })
    this.words = arr;
  },
  methods: {
    getCurrentSubject(query) {
      const findedItem =  this.subjectList && this.subjectList.find(item => item.path === query);
      if (!findedItem) return this.subjectList[0];
      return findedItem;
    },
    getSubjectFromQuery(query) {
      if (query && query.split('?subject=')) {
        return query.split('?subject=')[1];
      }
      return 'election66-topic1';
    },
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

      let config = {
        method: 'post',
        url: `https://asia-southeast1-thai-pbs-special-project.cloudfunctions.net/wordcloud-generic/topics/${this.currentSubject.path}/submit`,
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

.bg-overlay {
  position: absolute;
  width: 100vw;
  height: 100vh;
  // background-image: url('../assets/images/bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  opacity: 0.8;
  background-color: #f4f4f4;
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
  position: relative;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  position: relative;
  z-index: 100;

  h1 {
    font-size: 48px;
    color: white;
    background: #333332;
    padding: 8px 32px 0;
    line-height: 1;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }

  .topic {
    color: white;
    font-weight: bold;
    font-size: 64px;
  }

  @media only screen and (max-width: 1440px) {
    h1 {
      font-size: 36px;
    }

    .topic {
      color: white;
      font-weight: bold;
      font-size: 48px;
    }
  }

  @media only screen and (max-width: 768px) {

    &:not(.embed) {
      margin-top: 32px;
    }
  }

  @media only screen and (max-width: 576px) {
    h1 {
      font-size: 24px;
    }

    .topic {
      font-size: 32px;
      display: block;
    }
  }   
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
  border: 6px solid #E95B39;
  /* Use a conic gradient mask to hide and show the bits you want */
  --spread: 140deg;
  --start: 290deg;
  mask: conic-gradient(from var(--start), white 0 var(--spread), transparent var(--spread));
}


.logo {
  position: absolute;
  top: 32px;
  right: 32px;
  width: 150px;

  > img {
    max-width: 100%;
  }

  @media only screen and (max-width: 992px) {
    width: 100px;
    top: 16px;
    right: 16px;
  }  
}

.btn-question {
  margin-top: 24px;
  background: #ffffff;
  font-size: 26px;
  color: #000000;
  // border-radius: 50px;
  padding: 6px 100px;
  font-weight: 600;
  border: 2px solid #ffffff;
  -moz-transition: all .2s ease-in;
  -o-transition: all .2s ease-in;
  -webkit-transition: all .2s ease-in;
  transition: all .2s ease-in;
  border: 2px solid transition;
  z-index: 100;
  border-radius: 999px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

  &:hover {
    background: #fff;
    border-color: #2E3C47;
    color: #2E3C47;
  }

  @media only screen and (max-width: 576px) {
    padding: 6px 32px;
    font-size: 18px;
  }  
}

.cloud-area {
  width: 100%;
  // padding: 0 80px 16px;
  padding-top: 32px;
  margin-top: 32px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.2);

  @media only screen and (max-width: 1440px) {
    padding-top: 12px;
  }


  @media only screen and (max-width: 992px) {
    padding: 24px;
  }

  @media only screen and (max-width: 576px) {
    padding: 0;
  }
}


/* Modal */

.btn-submit {
  background: #707070;
  font-size: 20px;
  color: #fff;
  border-radius: 50px;
  padding: 4px 48px;
  font-weight: 600;
  border: 2px solid #707070;
  -moz-transition: all .2s ease-in;
  -o-transition: all .2s ease-in;
  -webkit-transition: all .2s ease-in;
  transition: all .2s ease-in;

  &:hover {
    background: #333332;
    color: white;
  }

  @media only screen and (max-width: 576px) {
    font-size: 18px;
  }  
}

.btn-footer {
  width: 100%;
}

.form-label {
  font-weight: 600;
  font-size: 24px;
  margin-bottom: 0;
}

.form-check-label {
  font-size: 22px;
  line-height: 1.2;

  @media only screen and (max-width: 576px) {
    font-size: 18px;
  }
}

textarea.form-control,
input.form-control {
  font-size: 22px;
}

.modal-content {
  font-size: 18px;
  border-radius: 24px;
  background: #F4F4F4;
  padding-top: 8px;
}

.modal-body {
  padding: 16px !important;
  @media only screen and (max-width: 576px) {
    padding: 0 16px 8px !important;
  }  
}

.btn-modal-close {
  position: absolute;
  border-radius: 50px;
  // padding: 6px 10px;
  // padding-right: 1px;
  background: #666666;
  border: 0;
  color: #fff;
  right: 8px;
  top: 8px;
  width: 32px;
  height: 32px;
  z-index: 100;

  > i {
    display: flex;
    align-items: center;
  }

  @media only screen and (max-width: 40em) {
    border-radius: 20px;
    right: -4px;
    top: -4px;
    z-index: 99;
  }
}

</style>