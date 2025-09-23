document.addEventListener("DOMContentLoaded", function () {
  if (window.location.href.includes("/search/label/")) {

    let label = decodeURIComponent(window.location.href.split("/search/label/")[1].split("?")[0]);

    let container = document.querySelector("#main") || document.querySelector("#content") || document.querySelector("#Blog1");
    if (!container) return;

    container.innerHTML = "<p>Memuat semua posting...</p>";

    let allPosts = [];
    let startIndex = 1;

    function fetchPosts() {
      let base = "/feeds/posts/default/-/" + encodeURIComponent(label);

      // Rakit query string tanpa & di template
      let params = "?alt=json-in-script";
      params += String.fromCharCode(38) + "max-results=150";
      params += String.fromCharCode(38) + "start-index=" + startIndex;
      params += String.fromCharCode(38) + "callback=handleData";

      let script = document.createElement("script");
      script.src = base + params;
      document.body.appendChild(script);
    }

    window.handleData = function (data) {
      if (!data.feed.entry) {
        if (allPosts.length > 0) {
          allPosts.sort((a, b) => a.title.localeCompare(b.title));

          let pager = document.querySelector(".blog-pager");
          if (pager) pager.remove();

          container.innerHTML = "";
          allPosts.forEach(post => {
            container.innerHTML += post.html; // HTML asli postingan
          });
        } else {
          container.innerHTML = "<p>Tidak ada posting ditemukan.</p>";
        }
        return;
      }

      data.feed.entry.forEach(entry => {
        allPosts.push({
          title: entry.title.$t,
          html: entry.content.$t
        });
      });

      startIndex += 150;
      fetchPosts();
    };

    fetchPosts();
  }
});
