<template>
  <div id="app">
    <div id="loading-screen" class="d-flex justify-content-center align-items-center" :class="{ 'is-loaded': isLoaded }">
      <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <!-- Button Footer -->
    <div class="container-fluid pt-0 pt-md-0 title-container">
      <div class="row">
        <div class="col-12">
          <div class="question text-center py-4">
            <h1 class="title">ขอ 1 คำที่คุณอยากแก้ไขด้าน "สวัสดิการ"</h1>
            <section class="btn-footer">
              <button type="button" class="btn-question" data-bs-toggle="modal" data-bs-target="#questionModal">ร่วมแสดงความเห็น <i class="bi bi-pencil-square ps-1"></i></button>
            </section>
          </div>
        </div>
        <div class="col-12">
          <div class="cloud-area full-height mt-0">
            <vue-word-cloud
              style="width: 100%; height: 70vh;"
              :words="words"
              :font-family="'DB Helvethaica X'"
              :color="([, weight]) => weight > 15 ? '#E95B39' : weight > 10 ? '#BEA69F' : weight > 0 ? '#CCCACA' : '#9A4312'"
              :spacing="spacing"
            :font-size-ratio="ratio">
            </vue-word-cloud>
          </div>
        </div>
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
                <label for="your-voice" class="form-label">คำที่อยากบอกของคุณ</label>
                <textarea class="form-control" id="your-voice" rows="2" v-model="text"></textarea>
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
                  <label class="form-check-label" for="other">ไม่ระบุ</label>
                </div>
                <p class="text-danger" v-show="genderError">โปรดเลือกเพศของคุณ</p>
              </div>
              <div class="col-12">
                <label class="form-label">ช่วงอายุของคุณ</label>
                <br/>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="generation" id="gen-z" value="gen-z" v-model="generation">
                  <label class="form-check-label" for="gen-z">น้อยกว่า 18 ปี</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="generation" id="gen-x" value="gen-x" v-model="generation">
                  <label class="form-check-label" for="gen-x">19 - 37 ปี</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="generation" id="gen-y" value="gen-y" v-model="generation">
                  <label class="form-check-label" for="gen-y">38-53 ปี</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="generation" id="baby-boomer" value="baby-boomer" v-model="generation">
                  <label class="form-check-label" for="baby-boomer">54 ปีขึ้นไป</label>
                </div>
                <p class="text-danger" v-show="generationError">โปรดเลือกช่วงอายุของคุณ</p>
              </div>
              <div class="col-12 text-center">
                <button class="btn-submit" type="submit" @click="nextModal()">ส่งข้อความ</button>
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
                <h5>ขอบคุณที่ร่วมกิจกรรม</h5>
                <h3 class="fw-bold">ขอ 1 คำ ปลุกกรุงเทพฯ</h3>
                <h5>กรุณาแจ้ง ชื่อ - นามสกุล และเบอร์โทรศัพท์<br/>สำหรับทีมงานติดต่อกลับ กรณีที่ท่านได้รับของที่ระลึก</h5>
              </div>
              <div class="col-12">
                <label for="fullname" class="form-label">ชื่อและนามสกุล</label>
                <input type="text" class="form-control" id="fullname" v-model="fullname"/>
              </div>
              <div class="col-12">
                <label for="phone" class="form-label">เบอร์มือถือเพื่อติดต่อกลับ</label>
                <input type="tel" class="form-control" id="phone" v-model="phone"/>
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
              <div class="col-12">
                <label style="font-size: 14px; font-weight: 400">โปรดทราบ : ข้อมูลของท่านใช้เฉพาะกิจกรรมนี้เท่านั้น</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="profileModal" tabindex="-1" aria-labelledby="profileModal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body p-4">
            <div class="row">
              <div class="col-12">
                <p>ขอบคุณที่ร่วมกิจกรรม</p>
                <h2>ขอ 1 คำกับอนาคตของประเทศไทยที่อยากเห็น</h2>
                <p>กรุณาแจ้ง ชื่อ - นามสกุล และเบอร์โทรศัพท์ สำหรับทีมงานติดต่อกลับ กรณีที่ท่านได้รับของที่ระลึก</p>
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
import VueWordCloud from 'vuewordcloud'
import { Modal } from 'bootstrap'

export default {
  name: "TagCloud",
  components: {
    VueWordCloud,
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

  $modal-backdrop-opacity: 0;

  #app {
    min-height: 100vh;
    position: relative;
  }

  .title-container {
    z-index: 100;
  }

  .title {
    font-size: 48px;
    color: white;
    font-weight: 600;
    padding: 10px 32px 4px;
    background-color: #333332;
    display: inline-block;
  }

  .text-heading,
  .text-subheading {
    font-weight: 600;
  }

  .logo {
    max-height: 90px;
  }

  .full-height {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  .cloud-area {
    //margin-top: 20px;
    height: 100%;
    position: relative;
    width: 100%;
  }

  .btn-question {
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

    &:hover {
      background: #fff;
      border-color: #2E3C47;
      color: #2E3C47;
    }
  }

  @media only screen and (max-width: 40em) {
    .btn-question {
      padding: 6px 20px;
    }
  }

  .btn-submit {
    background: #707070;
    font-size: 18px;
    color: #fff;
    border-radius: 50px;
    padding: 6px 60px;
    font-weight: 600;
    border: 2px solid #707070;
    -moz-transition: all .2s ease-in;
    -o-transition: all .2s ease-in;
    -webkit-transition: all .2s ease-in;
    transition: all .2s ease-in;

    &:hover {
      background: #fff;
      border: 2px solid #2E3C47;
      color: #2E3C47;
    }
  }

  .btn-footer {
    width: 100%;
  }

  .form-label {
    font-weight: 600;
    font-size: 24px;
  }

  .form-check-label {
    font-size: 22px;
    line-height: 1.2;
  }

  textarea.form-control,
  input.form-control {
    font-size: 22px;
  }

  .modal-content {
    font-size: 18px;
  }

  .btn-modal-close {
    position: absolute;
    border-radius: 50px;
    padding: 6px 10px;
    background: #666666;
    border: 0;
    color: #fff;
    right: -20px;
    top: -20px;

    @media only screen and (max-width: 40em) {
      border-radius: 0 0 0 10px;
      right: 0;
      top: 0;
      z-index: 99;
    }
  }

  #loading-screen {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background: #fff;
    z-index: 99;

    &.is-loaded {
      opacity: 0;
      overflow: hidden;
      height: 0;
      width: 0;
    }
  }
</style>