window.onload = () => {
  
  const content = document.querySelector('.content');
  
  let url = 'https://quran-api.santrikoding.com/api/surah/';
  
  async function showAllData() {
    const dataResult = await getData();
    const result = updateDataToCards(dataResult);
    content.innerHTML += result;
    search(dataResult);
  }
  
  showAllData();
  
  function getData(param) {
    const result = !param ? '' : param;
    return fetch(url + result)
      .then(response => response.json())
      .then(response => response);
  }
  
  function updateDataToCards(param) {
    let string = '';
    param.forEach(data => string += showCards(data));
    return string;
  }
  
  function showCards({nama_latin, nama, arti, deskripsi, nomor}) {
    return `<div class="col-md-6">
              <div class="card p-3 my-2">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <div class="d-flex flex-column">
                      <h4 class="fw-normal">${nama_latin}</h4>
                      <span class="fw-light">${arti}</span>
                    </div>
                    <h5 class="fw-normal">${nama}</h5>
                  </div>
                  <p class="fw-light my-3">
                    ${deskripsi.substr(0, 100)} ...
                  </p>
                  <button class="btn btn-outline-primary baca" data-bs-toggle="modal" data-bs-target="#modal" data-id="${nomor}">Baca Surat Ini</button>
                </div>
              </div>
            </div>`;
  }
  
  window.addEventListener('click', async function(event) {
    if (event.target.classList.contains('baca')) {
      const nomor = event.target.dataset.id;
      const data = await getData(nomor);
      const modalHeader = document.querySelector('.header');
      modalHeader.innerHTML = showModalContent(data);
    }
  });
  
  function showModalContent(data) {
    return `<div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title fw-normal" id="exampleModalLabel">Detail Surat</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                
                <div class="bg-primary bg-gradient p-4 rounded shadow-sm">
                    <div class="d-flex justify-content-between">
                      <div class="d-flex flex-column">
                        <h4 class="fw-normal text-white">${data.nama_latin}</h4>
                        <span class="fw-light text-light">${data.arti}</span>
                      </div>
                      <h5 class="fw-normal text-white">${data.nama}</h5>
                    </div>
                    <p class="fw-light text-light my-3">
                      ${data.deskripsi}
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="wrapper">
                        <span class="fw-light text-light">Jumlah Ayat : </span>
                        <span class="fw-normal text-white">${data.jumlah_ayat} ayat</span>
                      </div>
                      <div class="wrapper">
                        <span class="fw-light text-light">diturunkan surat : </span>
                        <span class="fw-normal text-white">${data.tempat_turun}</span>
                      </div>
                    </div>
                  </div>
          
                <ul class="list-group list-container">
                  ${updateDataAyat(data.ayat)}
                </ul>
          
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-primary rounded-1" data-bs-dismiss="modal">Close</button>
            </div>
          </div>`
  }
  
  function updateDataAyat(param) {
    let string = '';
    param.forEach(data => string += showListAyat(data));
    return string;
  }
  
  function showListAyat({ar: arab, idn, tr: translate}) {
    return `<li class="list-group-item p-3 my-2">
              <div class="wrapper mb-4">
                <i class="fw-light">${idn}</i>
              </div>
              <div class="wrapper">
                <h6 class="fw-normal text-end">${arab}</h6>
                <p class="fw-light text-end">${translate}</p>
              </div>
            </li>`
  }
  
  function search(dataResult) {
    const input = document.querySelector('#search');
    input.addEventListener('input', function() {
      const value = this.value.toLowerCase();
      dataResult.forEach(data => {
        const namaLatin = data.nama_latin.toLowerCase();
        const arti = data.arti.toLowerCase();
        if (namaLatin.indexOf(value) != -1 || arti.indexOf(value) != -1) content.innerHTML = showCards(data);
      });
    });
  }
  
}