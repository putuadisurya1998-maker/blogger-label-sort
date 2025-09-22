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
      let params = "?alt=json-in-script&max-results=150&start-index=" + startIndex + "&callback=handleData";
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
  container.innerHTML +=
    '<div class="post bar hentry">' +
      '<h2 class="post-title entry-title"><a href="' + post.url + '">' + post.title + '</a></h2>' +
      '<div class="post-body entry-content">' +
        '<img src="' + post.thumbnail + '" class="post-thumbnail" />' +
      '</div>' +
    '</div>';
});

        } else {
          container.innerHTML = "<p>Tidak ada posting ditemukan.</p>";
        }
        return;
      }

      data.feed.entry.forEach(entry => {
        let thumbnail = "https://via.placeholder.com/120x80?text=No+Image";
        if (entry.media$thumbnail) {
          thumbnail = entry.media$thumbnail.url;
        } else if (entry.content && entry.content.$t.match(/<img.*?src=\"(.*?)\"/)) {
          thumbnail = entry.content.$t.match(/<img.*?src=\"(.*?)\"/)[1];
        }

        allPosts.push({
          title: entry.title.$t,
          url: entry.link.find(l => l.rel === "alternate").href,
          thumbnail: thumbnail
        });
      });

      startIndex += 150;
      fetchPosts();
    };

    fetchPosts();
  }
});
