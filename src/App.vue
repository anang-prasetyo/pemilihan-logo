<template>
  <main class="d-flex flex-column container-fluid gap-4 align-items-center min-vh-100 p-md-2 col-12 col-md-6 position-relative" :class="user.userName === '' ? ' px-4' : ''">
    <!-- <coba-component></coba-component> -->
    
    <section v-if="isDialog" class="vh-100 vw-100 d-flex justify-content-center align-items-center position-fixed bg-white" @wheel.prevent @touchmove.prevent @scroll.prevent style="z-index: 10;">
      <div class="d-flex flex-column gap-2 w-100 position-relative p-3 align-items-center">
        <div>Edit Logo {{ tempPilihanEdit.logoNo + ' - ' + tempPilihanEdit.logoAuthor }}</div>
        <div style="max-width: 10rem;">
          <img :src="'https://firebasestorage.googleapis.com/v0/b/pemilihan-logo.appspot.com/o/coba%2FLOGO-tunas%20muda-'+ tempPilihanEdit.logoNo +'.jpg?alt=media&token=' + tempPilihanEdit.logoNo" class="rounded img-fluid img-thumbnail">
        </div>
        <textarea class="form-control" aria-label="With textarea" style="resize: none; height: 15rem;" v-model="tempPilihanEdit.logoDescription"></textarea>
        <div class="d-flex gap-2">
          <button class="btn btn-primary-2" @click="updatePilihanEdit()">Simpan perubahan</button>
          <button class="btn btn-light" @click="isDialog = false">Batal</button>
        </div>
      </div>
    </section>
    <nav v-if="user.userName !== '' && voter !== 0 && votePercent.length !== 0 && thisUser" class="position-fixed top-0 d-flex col-12 col-md-6" style="background: rgba(255,255,255,.2); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px); z-index: 5;">
      <ul v-if="thisUser.isVoted === true || user.idUser === 'HlrgZm7BNyNyaVjMCR4s'" class="d-flex flex-column list-unstyled align-items-center justify-content-around w-100 m-auto">
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
        <li v-if="isShowNotif" class="text-center pb-2" @click="isShowNotif = false" style="cursor: pointer;"><i class="bi bi-caret-up"></i> Sembunyikan</li>
        <li v-else class="text-center p-2" @click="isShowNotif = true" style="cursor: pointer;"><i class="bi bi-caret-down"></i> Tampilkan</li>
      </ul>
    </nav>
    <section v-if="adminState" class="d-flex align-items-center h-100">
      <div class="d-flex flex-column" :class="user.userName === '' ? '' : ''">
        <div v-if="user.userName !== ''" class="px-3" style="margin-top: 5rem;">
          <div class="display-4 mb-2">Halo <span v-if="user.userName !== ''" class="text-capitalize">{{ user.userName }}, </span>selamat datang di <b>Pilog.</b> (Pilih Logo)</div>
          <div class="mt-3 text-black-50">Silahkan pilih 1 logo yang kamu sukai. Logo yang mendapat vote terbanyak akan dijadikan logo baru Karang Taruna Tunas Muda.</div>
        </div>
        <div v-else class="d-flex flex-column w-100" style="z-index: 2;">
          <div class="d-flex justify-content-between mt-2">
            <div class="display-5">Pilog.</div>
            <div></div>
          </div>
          <div class="display-3 mt-5">Simulasi pengumpulan suara berbasis web sederhana yang mudah dipahami.</div>
          <div class="mt-3 text-black-50">Cobalah berpartisipasi secara daring/online dalam pengumpulan suara dengan cara yang sederhana dan mudah dipahami. Gunakan Nama dan Tanggal Lahir sebagai pengenal sebelum menentukan pilihanmu.</div>
        </div>
        <div v-if="user.userName === '' && adminState.isOpenReg" class="mt-4 mb-3 d-flex flex-column gap-2 w-100 border border-1 p-2 rounded-1" style="z-index: 2; background: rgba(255,255,255,.5); backdrop-filter: blur(80px); -webkit-backdrop-filter: blur(80px);">
          <label for="userName">Nama Lengkap</label>
          <input type="text" name="userName" v-model="newUsername" placeholder="Namamu" class="form-control input rounded w-100">
          <label for="tglLahir">Tanggal Lahir</label>
          <input type="date" name="tglLahir" v-model="newTglLahir" placeholder="Tanggal lahirmu" class="form-control input rounded w-100">
          <button v-if="newUsername && newTglLahir" @click="masukUser()" class="btn btn-dark rounded">Masuk</button>
          <button v-else class="btn btn-dark rounded" disabled>Masuk</button>
        </div>
        <div v-else-if="!adminState.isOpenReg" class="alert alert-danger mt-5" role="alert">Maaf untuk saat ini pendaftaran akun masih ditutup.</div>
      </div>
    </section>
    <section v-if="user.userName === ''" class="overflow-hidden position-absolute w-100 h-100" style="z-index: 1;">
      <blurry-gradient style="position: absolute; height: 100%; mix-blend-mode: darken; top: 0;left: 0; opacity: 1;"></blurry-gradient>
    </section>
    <section v-if="user.userName !== '' && thisUser" class="bg-white py-3 px-2 rounded w-100 row">
      <div class="col-12 d-flex align-items-center justify-content-between ">
        <div class="d-flex align-items-center gap-2">
          <div class="avatar">
            <div class="text-uppercase">{{ getFirstLetters(user.userName) }}</div>
          </div>
          <div v-if="user.userName !== ''" class="text-capitalize">{{ user.userName }}</div>
        </div>
        <div>
          <button class="btn btn-dark" @click="userReset()">Keluar</button>
        </div>
      </div>
      <div class="col-12"><hr></div>
      <div class="col-12">
        <div class="d-flex align-items-center gap-1">
          <i v-if="thisUser.isVoted === false" class="bi bi-plus text-danger" style="transform: rotate(45deg);"></i>
          <i v-else class="bi bi-check text-success"></i>
          <div v-if="thisUser.isVoted === false" class="text-danger">Belum memilih, segera pilih logo favoritmu.</div>
          <div v-else class="text-success">Sudah memilih, terimakasih telah berpartisipasi.</div>
        </div>
      </div>
      <div v-if="user.idUser === 'HlrgZm7BNyNyaVjMCR4s'" class="col-12">
        <hr>
        <div class="fs-5">Menu administrator</div>
        <div v-if="adminState" class="d-flex flex-column gap-1">
          <div>
            <div class="d-flex align-items-center justify-content-between border-bottom">
              <div>Pendaftaran akun baru</div>
              <div class="pretty p-switch p-fill">
                <input type="checkbox" v-model="adminState.isOpenReg" @click="hitungOpenReg()" />
                <div class="state p-primary">
                  <label></label>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="d-flex align-items-center justify-content-between border-bottom">
              <div>Upload logo</div>
              <div class="pretty p-switch p-fill">
                <input type="checkbox" v-model="adminState.isOpenUpload" />
                <div class="state p-primary">
                  <label></label>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="d-flex align-items-center justify-content-between border-bottom">
              <div>Edit logo</div>
              <div class="pretty p-switch p-fill">
                <input type="checkbox" v-model="adminState.isOpenEdit" @click="hitungOpenEdit()" />
                <div class="state p-primary">
                  <label></label>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="d-flex align-items-center justify-content-between">
              <div>Voting</div>
              <div class="pretty p-switch p-fill">
                <input type="checkbox" v-model="adminState.isOpenVote" @click="hitungOpenVote()" />
                <div class="state p-primary">
                  <label></label>
                </div>
              </div>
            </div>
          </div>
          <hr>
          <div>
            <div class="d-flex align-items-center justify-content-between">
              <div>Reset perhitungan suara</div>
              <button v-if="voter !== 0" class="btn btn-danger" @click="voteReset()">Reset</button>
              <button v-else class="btn btn-danger" disabled>Reset</button>
            </div>
          </div>
        </div>
        <hr>
        <div>
          <div v-if="dataAllUser" class="fs-5">Manajemen Users</div>
          <div v-if="adminState" class="mt-1 mb-4">
            <div class="d-flex align-items-center justify-content-between border-bottom">
              <div>Total User</div>
              <div class="text-black-50">{{ adminState.peserta }}</div>
            </div>
            <div class="mt-2 text-black-50" style="font-size: 12px;">Memilih</div>
            <div class="d-flex align-items-center justify-content-between border-bottom">
              <div>User sudah memilih</div>
              <div class="text-black-50">{{ adminState.voter }}</div>
            </div>
            <div class="d-flex align-items-center justify-content-between border-bottom">
              <div>User belum memilih</div>
              <div class="text-black-50">{{ adminState.peserta - adminState.voter }}</div>
            </div>
            <div class="mt-2 text-black-50" style="font-size: 12px;">Akses</div>
            <div class="d-flex align-items-center justify-content-between border-bottom">
              <div>User diizinkan</div>
              <div class="text-black-50">{{ adminState.peserta - adminState.pesertaDitolak }}</div>
            </div>
            <div class="d-flex align-items-center justify-content-between border-bottom">
              <div>User ditolak</div>
              <div class="text-black-50">{{ adminState.pesertaDitolak }}</div>
            </div>
          </div>
          <div class="mt-1 mb-4">
            <div class="mt-2 text-black-50" style="font-size: 12px;">Atur tampilan data user</div>
            <div class="d-flex align-items-center justify-content-between border-bottom">
              <div>User Name</div>
              <div class="pretty p-switch p-fill">
                <input type="checkbox" v-model="admUser.isUserName" @click="admUser.isUserName = !admUser.isUserName" />
                <div class="state p-primary">
                  <label></label>
                </div>
              </div>
            </div>
            <div class="d-flex align-items-center justify-content-between border-bottom">
              <div>Tanggal Lahir</div>
              <div class="pretty p-switch p-fill">
                <input type="checkbox" v-model="admUser.isTglLahir" @click="admUser.isTglLahir = !admUser.isTglLahir" />
                <div class="state p-primary">
                  <label></label>
                </div>
              </div>
            </div>
            <div class="d-flex align-items-center justify-content-between border-bottom">
              <div>Tanggal Milih</div>
              <div class="pretty p-switch p-fill">
                <input type="checkbox" v-model="admUser.isDate" @click="admUser.isDate = !admUser.isDate" />
                <div class="state p-primary">
                  <label></label>
                </div>
              </div>
            </div>
            <div class="d-flex align-items-center justify-content-between border-bottom">
              <div>Status</div>
              <div class="pretty p-switch p-fill">
                <input type="checkbox" v-model="admUser.isStatus" @click="admUser.isStatus = !admUser.isStatus" />
                <div class="state p-primary">
                  <label></label>
                </div>
              </div>
            </div>
            <div class="d-flex align-items-center justify-content-between">
              <div>Izinkan</div>
              <div class="pretty p-switch p-fill">
                <input type="checkbox" v-model="admUser.isIzinkan" @click="admUser.isIzinkan = !admUser.isIzinkan" />
                <div class="state p-primary">
                  <label></label>
                </div>
              </div>
            </div>
          </div>
          <ul v-if="dataAllUser" class="list-unstyled">
            <li class="d-flex gap-2 row border-bottom">
              <div v-if="admUser.isUserName" class="col text-black-50">User Name <i class="bi bi-arrow-down-short text-black-50"></i></div>
              <div v-if="admUser.isTglLahir" class="col text-black-50">Tanggal Lahir <i class="bi bi-arrow-down-short text-black-50"></i></div>
              <div v-if="admUser.isDate" class="col text-black-50 text-center">Tanggal Milih <i class="bi bi-arrow-down-short text-black-50"></i></div>
              <div v-if="admUser.isStatus" class="col text-black-50 text-center">Status <i class="bi bi-arrow-down-short text-black-50"></i></div>
              <div v-if="admUser.isIzinkan" class="col text-black-50 text-center">Izinkan</div>
            </li>
            <li v-for="au, i in dataAllUser" :key="i" class="d-flex gap-2 row border-bottom">
              <div v-if="admUser.isUserName" class="col text-capitalize">{{ au.userName }}</div>
              <div v-if="admUser.isTglLahir" class="col">{{ au.tglLahir }}</div>
              <div class="col text-center" v-if="au.dipilihDate && admUser.isDate">{{ au.dipilihDate.toDate().getMonth()+1 + '/' + au.dipilihDate.toDate().getDate() + '/' + au.dipilihDate.toDate().getFullYear() + ' ' + au.dipilihDate.toDate().getHours() + '.' + String(au.dipilihDate.toDate().getMinutes()).padStart(2, "0") }}</div>
              <div class="col text-center" v-else-if="!au.dipilihDate && admUser.isDate"><i class="bi bi-dash d-inline-flex"></i></div>
              <div v-if="au.isVoted && admUser.isStatus" class="col text-center"><i class="bi bi-check text-success d-inline-flex"></i></div>
              <div v-else-if="!au.isVoted && admUser.isStatus" class="col text-center"><i class="bi bi-dash d-inline-flex"></i></div>
              <div v-if="admUser.isIzinkan" class="col text-center">
                <div class="pretty p-icon p-round m-auto">
                  <input type="checkbox" v-model="au.isIzinkan" @click="updateUserIzinkan(dataAllUserId[i], i, au)" />
                  <div class="state p-primary">
                    <i class="bi bi-check icon"></i>
                    <label></label>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div class="text-black-50" style="font-size: 12px;">*Menampilkan semua data user</div>
        </div>
      </div>
      <div v-if="user.idUser === 'HlrgZm7BNyNyaVjMCR4s'" class="col-12">
        <hr>
        <div class="d-flex justify-content-between align-items-center">
          <div v-if="!isToUploadLogo">Kamu punya desain logo sendiri?</div>
          <button v-if="!isToUploadLogo" class="btn btn-light" @click="isToUploadLogo = true">Ajukan Logo</button>
        </div>
      </div>
      <div v-if="isToUploadLogo" class="col-12">
        <!-- <div>newUploadLogo : {{ newUploadLogo }}</div> -->
        <!-- <div>allUser : {{ allUser[0] }}</div> -->
        <div class="mt-3 text-danger" style="font-size: 12px;">Silahkan isi form berikut</div>
        <div class="mb-3">
          <label class="form-label">Nama Desainer</label>
          <select v-model="newUploadLogo.userName" class="form-select text-capitalize" aria-label="Default select example" required>
            <option selected>Pilih nama user</option>
            <option v-for="au, i in allUser" :key="i">
              <div>{{ au.userName }}<span>{{ au.idUser }}</span></div>
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Deskripsi</label>
          <textarea v-model="newUploadLogo.deskripsi" class="form-control" aria-label="With textarea" style="resize: none; height: 15rem;" required></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Token URL</label>
          <input type="text" v-model="newUploadLogo.token" class="form-control" required>
        </div>
      </div>
      <div v-if="isToUploadLogo" class="col-12 d-grid gap-2">
        <button v-if="newUploadLogo.userName && newUploadLogo.deskripsi && newUploadLogo.token" class="btn btn-primary" type="button">Upload</button>
        <button v-else class="btn btn-primary" type="button" disabled>Upload</button>
        <button class="btn btn-light" type="button" @click="isToUploadLogo = false">Batal</button>
      </div>
    </section>
    <section v-if="user.userName !== '' && thisUser" class="bg-white p-3 rounded w-100">
      <div class="">
        <div class="fs-5">Hasil Pilih</div>
        <div v-if="thisUser.isVoted === true || user.idUser === 'HlrgZm7BNyNyaVjMCR4s'">
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
        <div v-else class="text-black-50">Akan ditampilkan setelah kamu memilih logo favoritmu.</div>
      </div>
    </section>
    <section v-if="user.userName !== '' && thisUser && logoFilter && logoBgDipilih" class="">
      <header>
        <ol v-if="dataCoba && adminState" class="list-unstyled d-flex gap-4 row">
          <li v-for="dc, i in dataCoba" :key="i" class="d-flex flex-column col-12 position-relative p-0">
            <div class="d-flex align-items-center gap-2 py-2 px-3 bg-white">
              <div class="avatar">
                <div class="text-uppercase">{{ getFirstLetters(dc.logoAuthor) }}</div>
              </div>
              <div class="text-capitalize">{{ dc.logoAuthor }}</div>
            </div>
            <div class="no-urut">{{ dc.logoNo }}</div>
            <div v-if="dc.logoAuthorId === user.idUser && adminState.isOpenEdit" class="no-edit px-2 py-1 btn btn-white rounded" @click="openDialog(dc, dc.idPilihan)">Edit</div>
            <div class="d-flex align-items-center" :style="'background: ' + logoBgDipilih[i]" style="min-height: 24rem; max-height: 24rem;">
              <img :src="'https://firebasestorage.googleapis.com/v0/b/pemilihan-logo.appspot.com/o/transparan%2FLOGO-tunas%20muda-'+ dc.logoNo +'.png?alt=media&token=' + dc.logoNo" class="mx-auto d-block" style="height: 20rem; " :style="logoFilter[i] ? 'filter: ' + logoFilter[i] : ''">
            </div>
            <div class="d-flex justify-content-between gap-2 py-2 px-3">
              <div class="d-flex gap-1">
                <div v-for="bo, j in bgOption" :key="j" class="rounded" style="min-width: 1.5rem; min-height: 1.5rem" :style="bo === logoBgDipilih[i] ? ['background : ' + bo, 'outline: 2px solid cyan'] : ['background : ' + bo, 'border: 1px solid black']" @click="logoBgDipilih[i] = bo"></div>
              </div>
              <div class="d-flex gap-1">
                <div class="rounded text-center px-1 text-white" style="background: grey; border: 1px solid black; cursor: default" @click="logoFilter[i] = 'grayscale(1)'" :style="logoFilter[i] === 'grayscale(1)' ? 'outline: 2px solid cyan' : ''">bw</div>
                <div class="rounded text-center px-1 fw-bold" style="background: white; border: 1px solid black; cursor: default" @click="logoFilter[i] = 'none'" :style="logoFilter[i] === 'none' ? 'outline: 2px solid cyan' : ''">
                  <span style="color: red">c</span>
                  <span style="color: orange">o</span>
                  <span style="color: lightblue">l</span>
                  <span style="color: cyan">o</span>
                  <span style="color: lime">r</span>
                </div>
              </div>
            </div>
            <div v-if="thisUser.isVoted === true" class="d-flex align-items-center gap-2 py-1 px-3">
              <i v-if="thisUser.dipilih === dc.idPilihan" class="bi bi-heart-fill text-danger fs-4"></i>
              <i v-else class="bi bi-heart fs-4"></i>
              <span v-if="dc.logoVoter.length !== 0">Dipilih oleh {{ dc.logoVoter.length }} orang</span>
              <span v-else>Belum ada pemilih</span>
            </div>
            <!-- <div v-else class="mb-2"></div> -->
            <button v-if="thisUser.isVoted === false && adminState.isOpenVote && thisUser.isIzinkan" class="btn btn-primary-2 mx-3" @click="voteThisLogo(i, dc.idPilihan)">Pilih Logo {{ dc.logoNo }}</button>
            <button v-else-if="thisUser.dipilih === dc.idPilihan" class="btn btn-primary-2 mx-3" disabled>Kamu sudah memilih logo {{ dc.logoNo }}</button>
            <button v-else-if="!adminState.isOpenVote" class="btn btn-primary-2 mx-3" disabled>Waktu pemilihan sudah ditutup</button>
            <button v-else class="btn btn-primary-2 mx-3" disabled>Pilih Logo {{ dc.logoNo }}</button>
            <div class="mt-1 px-3"><span class="fw-semibold">{{ dc.logoAuthor }}</span> - {{ dc.logoDescription }}</div>
          </li>
        </ol>
      </header>
    </section>
    
    <footer v-if="user.userName !== ''" class="pb-3 w-100 d-flex flex-column gap-2 justify-content-center">
      <hr>
      <div class="text-center">Copyright &copy; 2023 by Anang</div>
      <div class="text-center">Pertanyaan, kritik, saran dan komentar</div>
      <div class="d-flex gap-2 justify-content-center">
        <button class="btn btn-dark rounded-5" onclick=" window.open('https://github.com/anang-prasetyo','_blank')"><i class="bi bi-github"></i></button>
        <button class="btn btn-dark rounded-5" onclick=" window.open('https://www.instagram.com/pra_anang/','_blank')"><i class="bi bi-instagram"></i></button>
        <button class="btn btn-dark rounded-5" onclick=" window.open('https://wa.me/6282133938464','_blank')"><i class="bi bi-whatsapp"></i></button>
      </div>
    </footer>
  </main>
</template>

<script setup>
//import
import { onMounted, ref } from "vue";
import { useDb } from "./firebase"
import firebase from "firebase/compat/app";
import swal from 'sweetalert'
import BlurryGradient from "./components/BlurryGradient.vue";
// import CobaComponent from "./components/CobaComponent.vue";

//ref database
const { db } = useDb()

const bgOption = ref(['white', '#E0E0E0', 'gray', '#525252', 'black'])
const logoFilter = ref(null)
const logoBgDipilih = ref(null)

//pilihan
const dataCoba = ref(null)
const newUploadLogo = ref({
  userName: null,
  deskripsi: null,
  token: null
})
const getPilihan = async() => {
  db.collection("pilihan")
  .orderBy("logoNo", "asc")
  .onSnapshot((querySnapshot) => {
    var pilihan = [];
    var _logoFilter = []
    var _logoBgDipilih = []
    var a = 0
    querySnapshot.forEach((doc) => {
      var id = doc.id
      var data = doc.data()
      pilihan.push(data)
      pilihan[a]["idPilihan"] = id
      _logoFilter.push('none')
      _logoBgDipilih.push('white')
      a++
    })
    dataCoba.value = pilihan
    logoFilter.value = _logoFilter
    logoBgDipilih.value = _logoBgDipilih
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
const tambahVote = (a) => {
  db.collection('pilihan').doc(a).update({
    'logoVoter': firebase.firestore.FieldValue.arrayUnion(user.value.userName)
  })
}
const addNewPilihan = () => {
  db.collection('pilihan').add({
    logoAuthor: newUploadLogo.value.userName,
    logoAuthorId: '',
    logoDescription: newUploadLogo.value.deskripsi,
    logoNo: Number(dataCoba.value.length+1),
    logoToken: ''
  })
}

//hitung
const vote = ref([])
const votePercent = ref([])
const voter = ref(null)
const adminState = ref(null)
const getHitung = async() => {
  db.collection('hitung').doc('TXExRenEX8vEfEb5OTBy')
    .onSnapshot((doc) => {
      var data = doc.data()
      adminState.value = (data)
      jmlUser.value = data.peserta
      voter.value = data.voter;
      if (data.voter !== 0){
        votePercent.value = (data.votePercent)
        vote.value = (data.vote)
        // console.log('votePercent -> ', votePercent.value);
      }
      else {
        for (let a = 0; a < dataCoba.value.length; a++){
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
const _thisPilihan = ref(null)
const votePercentCountReverse = (m,n) => {
  db.collection('pilihan').doc(m)
  .get().then((doc) => {
    _thisPilihan.value = doc.data()
  })
  .then(() => {
    vote.value[Number(_thisPilihan.value.logoNo - 1)]--
    voter.value--
    _thisPilihan.value.logoVoter.splice(n-1,1)
  })
  .then(() => {
    db.collection('pilihan').doc(m).update({
      'logoVoter': _thisPilihan.value.logoVoter,
    })
    db.collection('hitung').doc('TXExRenEX8vEfEb5OTBy').update({
      'voter': firebase.firestore.FieldValue.increment(-1),
      'vote': vote.value
    })
    for (let b = 0; b < votePercent.value.length; b++){
      if (b !== m && votePercent.value[b] !== 0){
        votePercent.value[b] = (100/voter.value)*vote.value[b]
      }
    }
    votePercent.value[m] = (100/voter.value)*vote.value[m]
    db.collection('hitung').doc('TXExRenEX8vEfEb5OTBy').update({
      'votePercent': votePercent.value
    })
  })
}
const voteReset = () => {
  swal({
    title: "Reset perhitungan?",
    text: "Semua perhitungan pada sesi ini akan dihapus",
    buttons: ["Batal", "Reset"],
    dangerMode: true
  })
  .then((willReset) => {
    if (willReset) {
      votePercent.value = []
      vote.value = []
      voter.value = 0
      resetHitung()
      updateAllUser()
      // user.value.dipilih = null
      // user.value.isVoted = false
      // localStorage.setItem("isVoted", false)
    }
  })
  .then(() => console.log('done reset all user'))
}
const tambahHitung = () => {
  db.collection('hitung').doc('TXExRenEX8vEfEb5OTBy').update({
    'voter': firebase.firestore.FieldValue.increment(1),
    'vote': vote.value,
    'votePercent': votePercent.value
  })
}
const hitungOpenReg = () => {
  if (!adminState.value.isOpenReg){
    db.collection('hitung').doc('TXExRenEX8vEfEb5OTBy').update({
      'isOpenReg': true,
    })
  }
  else {
    db.collection('hitung').doc('TXExRenEX8vEfEb5OTBy').update({
      'isOpenReg': false,
    })
  }
}
const hitungOpenVote = () => {
  if (!adminState.value.isOpenVote){
    db.collection('hitung').doc('TXExRenEX8vEfEb5OTBy').update({
      'isOpenVote': true,
    })
  }
  else {
    db.collection('hitung').doc('TXExRenEX8vEfEb5OTBy').update({
      'isOpenVote': false,
    })
  }
}
const hitungOpenEdit = () => {
  if (!adminState.value.isOpenEdit){
    db.collection('hitung').doc('TXExRenEX8vEfEb5OTBy').update({
      'isOpenEdit': true,
    })
  }
  else {
    db.collection('hitung').doc('TXExRenEX8vEfEb5OTBy').update({
      'isOpenEdit': false,
    })
  }
}

//user
const jmlUser = ref(null)
const allUser = ref(null)
const thisUser = ref(null)
const user = ref({
  idUser: null,
  userName: '',
  isVoted: null,
  dipilih: null
})
const admUser = ref({
  isUserName: true,
  isTglLahir: false,
  isDate: true,
  isStatus: true,
  isIzinkan: true,
})
const newUsername = ref(null)
const newTglLahir = ref(null)
const dataAllUser = ref(null)
const dataAllUserId = ref(null)
const isToUploadLogo = ref(false)
const getAllUser = async() => {
  db.collection("user").orderBy("userName", "asc")
  // .orderBy("logoNo", "asc")
  .onSnapshot((querySnapshot) => {
    var _dataAllUser = [];
    var _dataAllUserId = [];
    querySnapshot.forEach((doc) => {
      var data = doc.data()
      _dataAllUserId.push(doc.id);
      _dataAllUser.push(data);
      // if (data.isVoted){
      // }
    })
    dataAllUser.value = _dataAllUser
    dataAllUserId.value = _dataAllUserId
  })
}
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
    userName: newUsername.value.toLowerCase(),
    tglLahir: newTglLahir.value,
    joinDate: firebase.firestore.FieldValue.serverTimestamp(),
    isVoted: false,
    dipilih: null,
    dipilihDate: null,
    isIzinkan: true
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
        thisUser.value["idUser"] = doc.id
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
    window.scrollTo(0,0);
  })
}
const getUser = async() => {
  newUsername.value = localStorage.getItem("idUser")
  db.collection("user")
  .onSnapshot((querySnapshot) => {
    var _allUser = []
    var a = 0
    querySnapshot.forEach((doc) => {
      var id = doc.id
      var data = doc.data()
      _allUser.push(data)
      _allUser[a]["idUser"] = id
      if (doc.id === localStorage.getItem("idUser")){
        thisUser.value = data
        thisUser.value["idUser"] = id
      }
      a++
    })
    allUser.value = _allUser
  })
  console.log('thisUser -> ', thisUser.value);
}
const cekJmlPemilih = ref(null)
const updateUser = (a) => {
  db.collection('pilihan').doc(a)
  .get().then((doc) => {
    var data = doc.data()
    cekJmlPemilih.value = data.logoVoter.length
  })
  console.log('thisUser.value.idUser -> ', thisUser.value.idUser);
  console.log('cekJmlPemilih.value -> ', cekJmlPemilih.value);
  db.collection('user').doc(thisUser.value.idUser).update({
    'isVoted': true,
    'dipilih': a,
    'dipilihDate': new Date(),
    'pemilihKe': cekJmlPemilih.value 
  })
  localStorage.setItem("isVoted", true)
  user.value.isVoted = localStorage.getItem("isVoted")
}
const updateUserIzinkan= (a,b,c) => {
  if (dataAllUser.value[b].isIzinkan){
    if (c.isVoted){
      votePercentCountReverse(c.dipilih, c.pemilihKe)
    }
    db.collection('hitung').doc('TXExRenEX8vEfEb5OTBy').update({
      'pesertaDitolak': firebase.firestore.FieldValue.increment(1)
    })
  }
  else {
    db.collection('hitung').doc('TXExRenEX8vEfEb5OTBy').update({
      'pesertaDitolak': firebase.firestore.FieldValue.increment(-1)
    })
  }
  db.collection('user').doc(a).update({
    'isIzinkan': !dataAllUser.value[b].isIzinkan,
    'isVoted': false,
    'dipilih': null,
    'dipilihDate': null,
    'pemilihKe': null,
  })
}
const updateAllUser = async() => {
  db.collection("user")
  .onSnapshot((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      var id = doc.id
      db.collection('user').doc(id).update({
        'isVoted': false,
        'dipilih': null,
        'dipilihDate': null,
        'pemilihKe': null
      })
    })
  })
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
  newUsername.value = null
  newTglLahir.value = null
}

//dialog edit
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
const isShowNotif = ref(false)
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



const voteThisLogo = (a, b) => {
  swal({
    title: "Kamu yakin pilih logo "+(a+1)+'?',
    text: "Kamu hanya bisa memilih 1(satu) kali saja! Setelah memilih, kamu bisa melihat hasil perolehan suara yang up to date.",
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
      isShowNotif.value = true
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
// function delay(milliseconds){
//   return new Promise(resolve => {
//     setTimeout(resolve, milliseconds);
//   });
// }


onMounted(() => {
  getPilihan()
  getHitung()
  if (localStorage.getItem("userName") !== null){
    user.value.idUser = localStorage.getItem("idUser")
    user.value.userName = localStorage.getItem("userName")
    user.value.isVoted = localStorage.getItem("isVoted")
    // user.value.dipilih = localStorage.getItem("dipilih")
  }
  else {
    localStorage.setItem("userName", "")
    localStorage.setItem("idUser", "")
    localStorage.setItem("isVoted", "")
    localStorage.setItem("dipilih", "")
  }
  getUser()
  getAllUser()
  // console.log('user.value.userName -> ', user.value.userName);
})
</script>

<style lang="scss">
@import '../node_modules/pretty-checkbox/src/pretty-checkbox.scss';

.pretty.p-switch .state:before {
  top: calc((0% - (100% - 1em)) - 15%);
}
.pretty.p-switch .state:before {
  width: calc(2em + 2px);
}
.pretty .state label:before, .pretty .state label:after {
  top: calc((0% - (100% - 1em)) - 10%);
}
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
.btn-primary-2 {
  background-color: var(--primary-color-shades-2);
  &:hover{
    background-color: var(--primary-color-shades-1);
  }
}
.btn-primary-2:disabled{
  background: var(--primary-color) !important;
}
.text-primary-2{
  color: var(--primary-color-shades-2);
}
/* level settings 👇 */

.no{
  &-urut, &-edit{
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 60px;
    background: white;
    color: #2d2d2d;
  }
  &-urut{
    width: 2rem;
    height: 2rem;
    left: 15px;
    border-radius: 3rem;
    box-shadow: 4px 4px 15px 0px rgba(0, 0, 0, .2);
    cursor: default;
  }
  &-edit{
    right: 15px;
    box-shadow: -4px 4px 15px 0px rgba(0, 0, 0, .2);
    cursor: pointer;
  }
}
.slider {
  /* slider */
  --slider-width: 100%;
  --slider-height: 6px;
  --slider-bg: #7D84B2;
  // --slider-bg: rgb(82, 82, 82);
  --slider-border-radius: 999px;
  /* level */
  --level-color: var(--primary-color-shades-2);
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