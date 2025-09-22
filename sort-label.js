document.addEventListener("DOMContentLoaded", function () {
  if (!window.location.href.includes("/search/label/")) return;

  let label = decodeURIComponent(window.location.href.split("/search/label/")[1].split("?")[0]);
  let container = document.querySelector(".blog-posts") || document.querySelector("#main") || document.querySelector("#Blog1");
  if (!container) return;

  container.innerHTML = "<p>Memuat semua posting...</p>";

  let allPosts = [];
  let startIndex = 1;

  function fetchPosts() {
    let base = "/feeds/posts/default/-/" + encodeURIComponent(label);
    let params = "?alt=json-in-script";
    params += "&max-results=150";
    params += "&start-index=" + startIndex;
    params += "&callback=handleData";

    let script = document.createElement("script");
    script.src = base + params;
    document.body.appendChild(script);
  }

  window.handleData = function (data) {
    if (!data.feed.entry) {
      if (allPosts.length > 0) {
        // urut A → Z
        allPosts.sort((a, b) => a.title.localeCompare(b.title));

        // hapus pager default
        let pager = document.querySelector(".blog-pager");
        if (pager) pager.remove();

        // kosongkan container
        container.innerHTML = "";

        // tampilkan semua posting
        allPosts.forEach(post => {
          container.innerHTML +=
            '<div class="post-outer">' +
              '<article class="post hentry">' +
                '<header class="post-header">' +
                  '<h2 class="post-title entry-title">' +
                    '<a href="' + post.url + '">' + post.title + '</a>' +
                  '</h2>' +
                '</header>' +
                '<div class="post-body entry-content">' +
                  '<div class="post-thumbnail"><a href="' + post.url + '">' +
                    '<img src="' + post.thumbnail + '" />' +
                  '</a></div>' +
                  '<div class="post-excerpt">' + post.excerpt + '</div>' +
                '</div>' +
              '</article>' +
            '</div>';
        });
      } else {
        container.innerHTML = "<p>Tidak ada posting ditemukan.</p>";
      }
      return;
    }

    // ambil data posting
    data.feed.entry.forEach(entry => {
      let thumbnail = "https://via.placeholder.com/120x80?text=No+Image";
      if (entry.media$thumbnail) {
        thumbnail = entry.media$thumbnail.url;
      } else if (entry.content && entry.content.$t.match(/<img.*?src=\"(.*?)\"/)) {
        thumbnail = entry.content.$t.match(/<img.*?src=\"(.*?)\"/)[1];
      }

      // buat excerpt (maks 30 kata)
      let text = entry.summary ? entry.summary.$t : entry.content.$t.replace(/<[^>]+>/g,'');
      let excerpt = text.split(/\s+/).slice(0,30).join(' ') + '...';

      allPosts.push({
        title: entry.title.$t,
        url: entry.link.find(l => l.rel==="alternate").href,
        thumbnail: thumbnail,
        excerpt: excerpt
      });
    });

    startIndex += 150;
    fetchPosts();
  };

  fetchPosts();
});
