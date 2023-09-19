<template>
  <main class="d-flex flex-column container-fluid gap-5 vh-100 d-flex align-items-center p-md-2 col-12 col-md-6 position-relative">
    <section v-if="isDialog" class="vh-100 vw-100 d-flex justify-content-center align-items-center position-fixed bg-white overflow-hidden" @wheel.prevent @touchmove.prevent @scroll.prevent style="z-index: 10;">
      <div class="d-flex flex-column gap-2 w-100 position-relative p-3 align-items-center justify-content-center">
        <div>Edit Logo {{ tempPilihanEdit.logoNo + ' - ' + tempPilihanEdit.logoAuthor }}</div>
        <div style="max-width: 10rem;">
          <img :src="'https://firebasestorage.googleapis.com/v0/b/pemilihan-logo.appspot.com/o/LOGO-tunas%20muda-'+ tempPilihanEdit.logoNo +'.jpg?alt=media&token=' + tempPilihanEdit.logoNo" class="rounded img-fluid">
        </div>
        <textarea class="form-control" aria-label="With textarea" style="resize: none; height: 10rem;" v-model="tempPilihanEdit.logoDescription"></textarea>
        <div class="d-flex gap-2">
          <button class="btn btn-primary" @click="updatePilihanEdit()">Simpan perubahan</button>
          <button class="btn btn-light" @click="isDialog = false">Batal</button>
        </div>
      </div>
    </section>
    <nav v-if="user.userName !== '' && voter !== 0 && votePercent.length !== 0" class="position-fixed top-0 d-flex col-12 col-md-6 glassy-nav bg-white shadow">
      <ul class="d-flex flex-column list-unstyled align-items-center justify-content-around w-100 m-auto">
        <li v-if="isShowNotif" class="pt-2">
          <ol class="list-unstyled">
            <li v-for="i in 4" :key="i" class="row">
              <span v-if="votePercent[i-1] != 0" class="col-auto">Logo {{ i }}</span>
              <label v-if="votePercent[i-1] != 0" class="col slider">
                <input type="range" id="volume" name="volume" min="0" max="100" :value="(votePercent[i-1]).toFixed(0)" class="level" disabled/>
              </label>
              <span v-if="votePercent[i-1] != 0" class="col-2">{{ (votePercent[i-1]).toFixed(0) }}%</span>
            </li>
          </ol>
        </li>
        <li v-if="isShowNotif" class="text-center pb-2" @click="isShowNotif = false" style="cursor: pointer;">Sembunyikan</li>
        <li v-else class="text-center p-2" @click="isShowNotif = true" style="cursor: pointer;">Tampilkan</li>
      </ul>
    </nav>
    <section class="d-flex align-items-center">
      <div class="vh-100 d-flex flex-column align-items-center justify-content-center text-center">
        <div class="display-4 mb-2">Halo <span v-if="user.userName !== ''" class="text-capitalize">{{ user.userName }}, </span>selamat datang di PEMILOG (Pemilihan Logo)</div>
        <div>Silahkan pilih 1 logo yang kamu sukai. Logo yang mendapat vote terbanyak akan dijadikan sebagai logo baru dari Karang Taruna Tunas Muda.</div>
        <div v-if="user.userName === ''" class="mt-5 d-flex flex-column gap-2 w-100">
          <label for="userName">Sebelum mulai kita kenalan dulu yuk, siapa nama kamu?</label>
          <input type="text" name="userName" v-model="newUsername" placeholder="Namamu" class="input text-center rounded w-100">
          <label for="tglLahir">Kapan kamu lahir?</label>
          <input type="date" name="tglLahir" v-model="newTglLahir" placeholder="Tanggal lahirmu" class="input text-center rounded w-100">
          <button v-if="newUsername && newTglLahir" @click="masukUser()" class="btn btn-primary rounded">Lanjutkan</button>
          <button v-else class="btn btn-primary rounded" disabled>Lanjutkan</button>
        </div>
      </div>
    </section>
    <!-- <div>
      <div>myFile : {{ myFile }}</div>
      <input type="file" name="myFile">
      <button @click="upload()">upload</button>
    </div> -->
    <section v-if="user.userName !== ''" class="w-100">
      <div class="">
        <div class="fs-2">Live Skor</div>
        <div v-if="voter != 0">Hasil perolehan suara dari {{ voter }} peserta</div>
        <div v-else>Hasil perolehan suara (Belum ada peserta pemilihan logo)</div>
        <ol v-if="dataCoba" class="list-unstyled m-0">
          <li v-for="dc, i in dataCoba" :key="i" class="row">
            <span class="col-auto">Logo {{ dc.logoNo }}</span>
            <label class="col slider">
              <input v-if="votePercent.length !== 0" type="range" id="volume" name="volume" min="0" max="100" :value="(votePercent[i]).toFixed(0)" class="level" disabled/>
              <input v-else type="range" id="volume" name="volume" min="0" max="100" value="0" class="level" disabled/>
            </label>
            <span v-if="votePercent.length !== 0" class="col-2">{{ (votePercent[i]).toFixed(0) }}%</span>
            <span v-else class="col-2">0%</span>
          </li>
        </ol>
      </div>
      <!-- <div v-if="user.userName !== ''">{{ user }}</div> -->
      <!-- <button class="btn btn-danger" @click="voteReset()">Reset vote</button>
      <div class="d-flex gap-1">
        <label for="userName">ganti nama</label>
        <input type="text" name="userName" v-model="newUsername" class="input">
      </div>
      <button class="btn btn-danger" @click="userReset()">Reset user</button> -->
    </section>
    <section v-if="user.userName !== ''" class="bg-white shadow-sm py-3 px-2 rounded w-100 row">
      <div class="col-12 d-flex align-items-center justify-content-between ">
        <div class="d-flex align-items-center gap-2">
          <div class="avatar">
            <div class="text-uppercase">{{ getFirstLetters(user.userName) }}</div>
          </div>
          <div v-if="user.userName !== ''" class="text-capitalize">{{ user.userName }}</div>
        </div>
        <div>
          <button class="btn btn-danger" @click="userReset()">Keluar</button>
        </div>
      </div>
      <div class="col-12"><hr></div>
      <div class="col-12">
        <div class="d-flex align-items-center gap-1">
          <i v-if="user.isVoted === 'false'" class="bi bi-plus text-danger" style="transform: rotate(45deg);"></i>
          <i v-else class="bi bi-check text-success"></i>
          <div v-if="user.isVoted === 'false'" class="text-danger">Belum memilih, segera pilih logo favoritmu.</div>
          <div v-else class="text-success">Sudah memilih, terimakasih telah berpartisipasi.</div>
        </div>
      </div>
    </section>
    <section v-if="user.userName !== ''" class="">
      <header>
        <ol v-if="dataCoba" class="list-unstyled d-flex gap-4 row">
          <li v-for="dc, i in dataCoba" :key="i" class="d-flex flex-column gap-1 col-12 position-relative">
            <div class="no-urut">{{ dc.logoNo }}</div>
            <div v-if="dc.logoAuthorId === user.idUser" class="no-edit px-2 py-1 btn btn-white rounded" @click="openDialog(dc, dataCobaId[i])">Edit</div>
            <img :src="'https://firebasestorage.googleapis.com/v0/b/pemilihan-logo.appspot.com/o/LOGO-tunas%20muda-'+ dc.logoNo +'.jpg?alt=media&token=' + dc.logoNo" class="card-img rounded">
            <button v-if="user.isVoted === 'false'" class="btn btn-primary" @click="voteThisLogo(i, dataCobaId[i])">Pilih Logo {{ dc.logoNo }}</button>
            <button v-else-if="user.dipilih === dataCobaId[i]" class="btn btn-primary" disabled>Kamu sudah memilih logo {{ dc.logoNo }}</button>
            <button v-else class="btn btn-primary" disabled>Pilih Logo {{ dc.logoNo }}</button>
            <div>{{ dc.logoAuthor }} - {{ dc.logoDescription }}</div>
          </li>
        </ol>
      </header>
    </section>
    
    <footer v-if="user.userName !== ''" class="pb-3 w-100 d-flex flex-column gap-2 justify-content-center">
      <hr>
      <div class="text-center">Copyright &copy; 2023 by Anang</div>
      <div class="d-flex gap-2 justify-content-center">
        <button class="btn btn-light rounded-5" onclick=" window.open('https://github.com/anang-prasetyo','_blank')"><i class="bi bi-github"></i></button>
        <button class="btn btn-light rounded-5" onclick=" window.open('https://www.instagram.com/pra_anang/','_blank')"><i class="bi bi-instagram"></i></button>
        <button class="btn btn-light rounded-5" onclick=" window.open('https://wa.me/6282133938464','_blank')"><i class="bi bi-whatsapp"></i></button>
      </div>
    </footer>
  </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useDb } from "./firebase"
import firebase from "firebase/compat/app";
import swal from 'sweetalert'

const { db } = useDb()

const isDialog = ref(false)
const tempPilihanEdit = ref({
  logoAuthor: null,
  logoDescription: null,
  logoNo: null,
  logoId: null
})
const openDialog = (a, b) => {
  isDialog.value = true
  tempPilihanEdit.value.logoAuthor = a.logoAuthor
  tempPilihanEdit.value.logoDescription = a.logoDescription
  tempPilihanEdit.value.logoNo = a.logoNo
  tempPilihanEdit.value.logoId = b
}
const isShowNotif = ref(true)
const tambahVote = (a) => {
  db.collection('pilihan').doc(a).update({
    'logoVoter': firebase.firestore.FieldValue.arrayUnion(user.value.userName)
  })
}
const updatePilihanEdit = () => {
  swal({
    title: "Simpan perubahan?",
    text: "Pastikan data yang kamu masukan sudah benar",
    buttons: ["Batal", "Simpan perubahan"],
  })
  .then((willUpdate) => {
    if (willUpdate) {
      db.collection('pilihan').doc(tempPilihanEdit.value.logoId).update({
        'logoDescription': tempPilihanEdit.value.logoDescription
      })
      isDialog.value = false
    }
  });
}
const tambahHitung = () => {
  db.collection('hitung').doc('TXExRenEX8vEfEb5OTBy').update({
    'voter': firebase.firestore.FieldValue.increment(1),
    'vote': vote.value,
    'votePercent': votePercent.value
  })
}
const updateUser = (a) => {
  db.collection('user').doc(user.value.idUser).update({
    'isVoted': true,
    'dipilih': a
  })
  localStorage.setItem("isVoted", true)
  user.value.isVoted = localStorage.getItem("isVoted")
}
const resetHitung = () => {
  db.collection('hitung').doc('TXExRenEX8vEfEb5OTBy').update({
    'voter': voter.value,
    'vote': vote.value,
    'votePercent': votePercent.value
  })
  db.collection("pilihan")
  .onSnapshot((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      db.collection("pilihan").doc(doc.id).update({
        'logoVoter': []
      })
    })
  })
}
const dataCoba = ref(null)
const dataCobaId = ref(null)
const getPilihan = async() => {
  db.collection("pilihan")
  .orderBy("logoNo", "asc")
  .onSnapshot((querySnapshot) => {
    var pilihan = [];
    var pilihanId = [];
    querySnapshot.forEach((doc) => {
      pilihanId.push(doc.id);
      pilihan.push(doc.data());
    })
    dataCoba.value = pilihan
    dataCobaId.value = pilihanId
  })
}
const jmlUser = ref(null)
const getHitung = async() => {
  db.collection('hitung').doc('TXExRenEX8vEfEb5OTBy')
    .onSnapshot((doc) => {
      var data = doc.data()
      jmlUser.value = data.peserta
      voter.value = data.voter;
      if (data.voter !== 0){
        votePercent.value = (data.votePercent)
        vote.value = (data.vote)
        // console.log('votePercent -> ', votePercent.value);
      }
      else {
        for (let a = 0; a < dataCobaId.value.length; a++){
          votePercent.value.push(0)
          if (dataCoba.value[a].logoVoter.length == 0){
            vote.value.push(0)
          }
          else {
            vote.value.push(dataCoba.value[a].logoVoter.length)
          }
        }
      }
    }
  )
}
const allUser = ref(null)
const thisUser = ref(null)
const getUser = async() => {
  db.collection("user")
  .onSnapshot((querySnapshot) => {
    var _allUser = []
    querySnapshot.forEach((doc) => {
      var data = doc.data()
      _allUser.push(data)
      if (data.userName === newUsername.value){
        thisUser.value = data
      }
    })
    allUser.value = _allUser
  })
}

const vote = ref([])
const votePercent = ref([])
const voter = ref(null)
const votePercentCount = (m) => {
  if (voter.value == 1){
    votePercent.value[m] = 100
  }
  else{
    for (let b = 0; b < votePercent.value.length; b++){
      if (b !== m && votePercent.value[b] !== 0){
        votePercent.value[b] = (100/voter.value)*vote.value[b]
      }
    }
    votePercent.value[m] = (100/voter.value)*vote.value[m]
  }
}
const voteReset = () => {
  votePercent.value = [] 
  vote.value = [] 
  voter.value = 0
  resetHitung()
}
const userReset = () => {
  localStorage.removeItem('userName')
  localStorage.removeItem('idUser')
  localStorage.removeItem('isVoted')
  localStorage.removeItem('dipilih')
  user.value.idUser = ''
  user.value.userName = ''
  user.value.isVoted = ''
  user.value.dipilih = ''
}
const user = ref({
  idUser: null,
  userName: '',
  isVoted: null,
  dipilih: null
})
const newUsername = ref(null)
const newTglLahir = ref(null)
const setUserName = async() => {
  if (isNewUser.value){
    await addNewUser()
  }
  await getThisUser()
  .then(() => {
    localStorage.setItem("userName", newUsername.value)
    user.value.userName = localStorage.getItem("userName")
    newUsername.value = null
    // console.log('user.value.userName -> ', user.value.userName);
  })
}
const addNewUser = async() => {
  db.collection('user').add({
    userName: newUsername.value,
    tglLahir: newTglLahir.value,
    joinDate: firebase.firestore.FieldValue.serverTimestamp(),
    isVoted: false,
    dipilih: ''
  })
  db.collection('hitung').doc('TXExRenEX8vEfEb5OTBy').update({
    'peserta': firebase.firestore.FieldValue.increment(1),
  })
}
const isNewUser = ref(false)
const getThisUser = async() => {
  // console.log('newUsername -> ', newUsername.value);
  db.collection("user")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      var data = doc.data()
      if (data.userName.toLowerCase() === user.value.userName.toLowerCase()){
        thisUser.value = data
        localStorage.setItem("idUser", doc.id)
        user.value.idUser = localStorage.getItem("idUser")
        localStorage.setItem("isVoted", data.isVoted)
        user.value.isVoted = localStorage.getItem("isVoted")
        localStorage.setItem("dipilih", data.dipilih)
        user.value.dipilih = localStorage.getItem("dipilih")
      }
    })
  })
}
const checkUser = async() => {
  for (let a = 0; a < jmlUser.value-1; a++){
    if (allUser.value[a].userName.toLowerCase() === newUsername.value.toLowerCase() && allUser.value[a].tglLahir === newTglLahir.value){
      isNewUser.value = false
      // console.log('cek false');
      break
    }
    else {
      isNewUser.value = true
      // console.log('cek true');
    }
  }
  // console.log('isNewUser -> ', isNewUser.value);
}
const masukUser = async() => {
  await checkUser()
  .then(() => {
    setUserName()
  })
}
const voteThisLogo = (a, b) => {
  swal({
    title: "Kamu yakin pilih logo "+(a+1)+'?',
    text: "Kamu hanya bisa memilih 1(satu) kali saja!",
    buttons: ["Batal", "Pilih"],
  })
  .then((willSelect) => {
    if (willSelect) {
      vote.value[a]++
      voter.value++
      votePercentCount(a)
      tambahVote(b)
      tambahHitung()
      updateUser(b)
      getThisUser()
    }
  });
}

function getFirstLetters(str) {
  const firstLetters = str
    .split(' ')
    .map(word => word[0])
    .slice(0,2)
    .join('');

  return firstLetters;
}

onMounted(() => {
  getPilihan()
  getHitung()
  getUser()
  if (localStorage.getItem("userName") !== null){
    user.value.idUser = localStorage.getItem("idUser")
    user.value.userName = localStorage.getItem("userName")
    user.value.isVoted = localStorage.getItem("isVoted")
    user.value.dipilih = localStorage.getItem("dipilih")
  }
  else {
    localStorage.setItem("userName", "")
    localStorage.setItem("idUser", "")
    localStorage.setItem("isVoted", "")
    localStorage.setItem("dipilih", "")
  }
  // console.log('user.value.userName -> ', user.value.userName);
})
</script>

<style lang="scss">

.avatar {
  background: lightblue;
  min-height: 2rem;
  min-width: 2rem;
  max-height: 2rem;
  max-width: 2rem;
  border-radius: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.glassy-nav {
  z-index: 4;
  // -webkit-backdrop-filter: blur(20px);
  // backdrop-filter: blur(20px);
  // background: rgba(244, 247, 248, 0.5);
}
/* level settings 👇 */

.no{
  &-urut, &-edit{
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 10px;
    background: white;
    color: #2d2d2d;
  }
  &-urut{
    width: 2rem;
    height: 2rem;
    left: 23px;
    border-radius: 3rem;
    box-shadow: 4px 4px 15px 0px rgba(0, 0, 0, .2);
    cursor: default;
  }
  &-edit{
    right: 23px;
    box-shadow: -4px 4px 15px 0px rgba(0, 0, 0, .2);
    cursor: pointer;
  }
}
.slider {
  /* slider */
  --slider-width: 100%;
  --slider-height: 6px;
  --slider-bg: rgb(82, 82, 82);
  --slider-border-radius: 999px;
  /* level */
  --level-color: #00ffff;
  --level-transition-duration: .1s;
  /* icon */
  --icon-margin: 15px;
  --icon-color: var(--slider-bg);
  --icon-size: 25px;
}

.slider {
  cursor: default;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: reverse;
  -ms-flex-direction: row-reverse;
  flex-direction: row-reverse;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.slider .volume {
  display: inline-block;
  vertical-align: top;
  margin-right: var(--icon-margin);
  color: var(--icon-color);
  width: var(--icon-size);
  height: auto;
}

.slider .level {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: var(--slider-width);
  height: var(--slider-height);
  background: var(--slider-bg);
  overflow: hidden;
  border-radius: var(--slider-border-radius);
  -webkit-transition: height var(--level-transition-duration);
  -o-transition: height var(--level-transition-duration);
  transition: height var(--level-transition-duration);
  cursor: inherit;
}

.slider .level::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 0;
  height: 0;
  -webkit-box-shadow: -200px 0 0 200px var(--level-color);
  box-shadow: -200px 0 0 200px var(--level-color);
}

// .slider:hover .level {
//   height: calc(var(--slider-height) * 2);
// }
</style>