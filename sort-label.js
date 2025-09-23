document.addEventListener("DOMContentLoaded", function () {
  // Cek halaman label
  if (window.location.href.includes("/search/label/")) {

    // Ambil nama label dari URL
    let label = decodeURIComponent(window.location.href.split("/search/label/")[1].split("?")[0]);

    // Pilih container utama postingan
    let container = document.querySelector("#main") || document.querySelector("#content") || document.querySelector("#Blog1");
    if (!container) return;

    container.innerHTML = "<p>Memuat semua posting...</p>";

    let allPosts = [];
    let startIndex = 1;

    // Fungsi ambil feed postingan
    function fetchPosts() {
      let base = "/feeds/posts/default/-/" + encodeURIComponent(label);
      let params = "?alt=json-in-script&max-results=150&start-index=" + startIndex + "&callback=handleData";
      let script = document.createElement("script");
      script.src = base + params;
      document.body.appendChild(script);
    }

    // Callback saat feed diterima
    window.handleData = function (data) {
      if (!data.feed.entry) {
        if (allPosts.length > 0) {
          // Urutkan A → Z berdasarkan judul
          allPosts.sort((a, b) => a.title.localeCompare(b.title));

          // Hapus pager default
          let pager = document.querySelector(".blog-pager");
          if (pager) pager.remove();

          // Kosongkan container
          container.innerHTML = "";

          // Masukkan HTML asli postingan ke container
          allPosts.forEach(post => {
            container.innerHTML += post.html;
          });
        } else {
          container.innerHTML = "<p>Tidak ada posting ditemukan.</p>";
        }
        return;
      }

      // Simpan setiap postingan ke array
      data.feed.entry.forEach(entry => {
        allPosts.push({
          title: entry.title.$t,
          html: entry.content.$t  // HTML asli postingan
        });
      });

      startIndex += 150;
      fetchPosts();
    };

    // Ambil postingan pertama
    fetchPosts();
  }
});
