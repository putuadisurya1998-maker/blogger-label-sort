document.addEventListener("DOMContentLoaded", function () {
  if (window.location.href.includes("/search/label/")) {

    // Pilih container utama postingan
    let container = document.querySelector("#main") || document.querySelector("#content") || document.querySelector("#Blog1");
    if (!container) return;

    // Ambil semua elemen postingan saat ini
    let posts = Array.from(container.querySelectorAll(".post"));

    if (posts.length === 0) {
      container.innerHTML = "<p>Memuat semua posting...</p>";
      // Jika container kosong, script lama untuk fetch feed bisa ditambahkan di sini
      return;
    }

    // Simpan judul dan elemen postingan
    let postArray = posts.map(post => {
      let titleEl = post.querySelector(".post-title") || post.querySelector("h2 a");
      let title = titleEl ? titleEl.textContent.trim() : "";
      return { title: title, element: post };
    });

    // Urutkan A → Z
    postArray.sort((a, b) => a.title.localeCompare(b.title));

    // Kosongkan container
    container.innerHTML = "";

    // Masukkan kembali postingan sesuai urutan
    postArray.forEach(postObj => {
      container.appendChild(postObj.element);
    });
  }
});
