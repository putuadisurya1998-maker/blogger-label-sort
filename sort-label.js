<div id="sorted-posts"></div>

<script type="text/javascript">
document.addEventListener("DOMContentLoaded", function() {
  if (window.location.href.indexOf("/search/label/") === -1) return;

  var container = document.getElementById("sorted-posts");
  if (!container) return;
  container.innerHTML = "<p>Loading posts...</p>";

  var label = decodeURIComponent(window.location.pathname.split("/label/")[1]);
  var feedUrl = "/feeds/posts/default/-/" + label + "?alt=json&amp;max-results=500";

  fetch(feedUrl)
    .then(function(res) { return res.json(); })
    .then(function(data) {
      var entries = data.feed.entry || [];
      if (entries.length === 0) {
        container.innerHTML = "<p>No posts found.</p>";
        return;
      }

      var posts = entries.map(function(entry) {
        var linkObj = entry.link.find(function(l){ return l.rel === "alternate"; });
        var link = linkObj ? linkObj.href : "#";
        var title = entry.title.$t;
        var content = entry.content ? entry.content.$t : (entry.summary ? entry.summary.$t : "");

        // Ambil thumbnail gambar pertama
        var imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
        var thumb = imgMatch ? imgMatch[1].replace(/&/g, "&amp;") : "https://via.placeholder.com/180x120?text=No+Image";

        // Ambil text summary tanpa HTML
        var textOnly = content.replace(/<[^>]+>/g, "");
        var summary = textOnly.length > 150 ? textOnly.substring(0, 150) + "..." : textOnly;

        return { title: title, link: link, thumb: thumb, summary: summary };
      });

      // Urutkan A-Z
      posts.sort(function(a, b) { return a.title.localeCompare(b.title); });

      // Tampilkan semua post
      container.innerHTML = "";
      posts.forEach(function(post) {
        container.innerHTML += ''
          + '<article class="post bar hentry" style="display:flex;align-items:flex-start;gap:15px;margin-bottom:20px;padding-bottom:10px;border-bottom:1px solid #ddd;">'
          +   '<a href="' + post.link + '" style="flex-shrink:0;">'
          +     '<img src="' + post.thumb + '" style="width:180px;height:auto;border-radius:8px;object-fit:cover;display:block;" />'
          +   '</a>'
          +   '<div style="flex:1;">'
          +     '<h2 class="post-title entry-title" style="margin:0 0 5px 0;font-size:1.2em;line-height:1.3;">'
          +       '<a href="' + post.link + '" style="text-decoration:none;color:inherit;">' + post.title + '</a>'
          +     '</h2>'
          +     '<p style="margin:0 0 8px 0;">' + post.summary + '</p>'
          +     '<a href="' + post.link + '" style="color:#007bff;font-weight:bold;">Read more »</a>'
          +   '</div>'
          + '</article>';
      });
    })
    .catch(function(err) {
      container.innerHTML = "<p>Error loading posts.</p>";
      console.error(err);
    });
});
</script>
