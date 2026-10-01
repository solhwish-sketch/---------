/* 하루핀의 지도, 게시글, 언어, 저장 기능을 연결하는 순수 JavaScript입니다. */
(() => {
  "use strict";

  const STORAGE_KEY = "harupin-data-v1";
  const PROFILE_KEY = "harupin-nickname-v1";
  const locales = {
    jeonju: { name: "전주", center: [35.8467, 127.1296], zoom: 14 },
    tokyo: { name: "도쿄", center: [35.6812, 139.7671], zoom: 13 }
  };
  const categoryNames = {
    ko: { school: "학교생활", cafe: "동네 카페", food: "숨은 맛집", walk: "산책로" },
    ja: { school: "学校生活", cafe: "近所のカフェ", food: "隠れた名店", walk: "散歩道" }
  };
  const words = {
    ko: {
      lang: "ko", chooseRegion: "지역 선택", map: "동네 지도", write: "동네 이야기 나누기",
      feed: "동네 피드", profile: "마이페이지", nickname: "닉네임", residence: "거주 지역",
      place: "장소 이름", category: "카테고리", photo: "사진", story: "짧은 글",
      choose: "선택하세요", submit: "게시글 올리기", like: "좋아요", comment: "댓글",
      send: "등록", remove: "삭제", mine: "내가 쓴 글", all: "지역 피드 보기",
      empty: "아직 게시글이 없습니다.", askNickname: "내 게시글을 모아볼 닉네임을 입력하세요.",
      commentPrompt: "댓글을 입력하세요.", deleteConfirm: "이 게시글을 삭제할까요?",
      posted: "게시글 위치", mapLabel: "전주와 도쿄의 게시글 지도", regionLabel: "지역 선택",
      example: "예시", comments: "댓글", photoAlt: "게시글 사진", noImage: "사진 없음"
    },
    ja: {
      lang: "ja", chooseRegion: "地域を選択", map: "街の地図", write: "街の話をシェア",
      feed: "街の投稿", profile: "マイページ", nickname: "ニックネーム", residence: "居住地",
      place: "場所", category: "カテゴリー", photo: "写真", story: "ひとこと",
      choose: "選択してください", submit: "投稿する", like: "いいね", comment: "コメント",
      send: "送信", remove: "削除", mine: "自分の投稿", all: "地域の投稿を見る",
      empty: "投稿はまだありません。", askNickname: "自分の投稿を見るニックネームを入力してください。",
      commentPrompt: "コメントを入力してください。", deleteConfirm: "この投稿を削除しますか？",
      posted: "投稿の場所", mapLabel: "全州と東京の投稿マップ", regionLabel: "地域を選択",
      example: "サンプル", comments: "コメント", photoAlt: "投稿の写真", noImage: "写真なし"
    }
  };
  const examples = [
    { id: "ex-j-1", nickname: "하루", region: "jeonju", place: "전북대학교 구정문", category: "cafe", story: "수업 끝나고 들르기 좋은 조용한 카페예요. 창가 자리가 특히 좋아요!", lat: 35.8462, lng: 127.1298, reactions: ["☕", "💙"], likes: 8, comments: [{ nickname: "민지", text: "다음에 같이 가요!" }] },
    { id: "ex-j-2", nickname: "민지", region: "jeonju", place: "객리단길", category: "food", story: "골목마다 작은 가게가 많아서 구경하는 재미가 있어요. 저녁 산책 추천!", lat: 35.8176, lng: 127.1394, reactions: ["💙"], likes: 12, comments: [] },
    { id: "ex-j-3", nickname: "도윤", region: "jeonju", place: "전북대학교 중앙도서관", category: "school", story: "시험 기간에 공부하기 좋은 자리와 주변 산책 코스를 공유해요.", lat: 35.8469, lng: 127.1291, reactions: ["📚"], likes: 5, comments: [] },
    { id: "ex-t-1", nickname: "ゆい", region: "tokyo", place: "上野公園", category: "walk", story: "朝の散歩にぴったり。木陰が多くて、ゆっくり過ごせます。", lat: 35.7156, lng: 139.7745, reactions: ["🌿", "💙"], likes: 10, comments: [] },
    { id: "ex-t-2", nickname: "そら", region: "tokyo", place: "神保町の小さな喫茶店", category: "cafe", story: "古本屋めぐりの休憩におすすめ。落ち着いた雰囲気でした。", lat: 35.6958, lng: 139.7575, reactions: ["☕"], likes: 7, comments: [{ nickname: "ゆい", text: "行ってみたいです！" }] },
    { id: "ex-t-3", nickname: "あお", region: "tokyo", place: "谷中銀座", category: "food", story: "食べ歩きが楽しい商店街。夕方の景色もきれいでした。", lat: 35.7278, lng: 139.7667, reactions: ["😋"], likes: 9, comments: [] }
  ];

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const mapElement = $("#map");
  const form = $("#post-form");
  const feed = $("#post-list");
  if (!mapElement || !form || !feed) return;

  let language = "ko";
  let currentRegion = "jeonju";
  let showMine = false;
  let currentNickname = "";
  let draftLocation = null;
  let draftMarker = null;
  let posts = loadPosts();
  let map;
  let markers = [];

  function loadPosts() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(saved)) return saved;
    } catch (error) {
      console.warn("저장된 게시글을 읽지 못했습니다.", error);
    }
    return examples.map((post) => ({ ...post, comments: post.comments || [], reactions: post.reactions || [], photo: "", isExample: true }));
  }

  function savePosts() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (error) {
      alert(language === "ko" ? "저장 공간이 부족해요. 사진 크기를 줄여 다시 시도해 주세요." : "保存容量が不足しています。写真を小さくして再度お試しください。");
      console.warn("게시글을 저장하지 못했습니다.", error);
    }
  }

  function setText(element, text) {
    if (element) element.textContent = text;
  }

  /* 선택한 언어에 맞춰 화면의 제목, 버튼, 폼 안내 문구를 바꿉니다. */
  function applyLanguage() {
    const w = words[language];
    document.documentElement.lang = w.lang;
    setText($("header h1"), "하루핀 ハルピン");
    setText($("#region-heading"), w.chooseRegion);
    setText($("#map-heading"), w.map);
    setText($("#write-heading"), w.write);
    setText($("#feed-heading"), w.feed);
    setText($("#mypage-button"), showMine ? w.all : w.profile);
    mapElement.setAttribute("aria-label", w.mapLabel);
    const regionGroup = $("[aria-labelledby='region-heading'] [role='group']");
    if (regionGroup) regionGroup.setAttribute("aria-label", w.regionLabel);

    const labels = { nickname: w.nickname, "post-region": w.residence, place: w.place, category: w.category, photo: w.photo, story: w.story };
    Object.entries(labels).forEach(([id, text]) => setText($(`label[for='${id}']`), text));
    setText($("#post-form button[type='submit']"), w.submit);
    const regionSelect = $("#post-region");
    if (regionSelect) {
      regionSelect.options[0].textContent = w.choose;
      regionSelect.options[1].textContent = language === "ko" ? "전주" : "全州";
      regionSelect.options[2].textContent = language === "ko" ? "도쿄" : "東京";
    }
    const categorySelect = $("#category");
    if (categorySelect) {
      categorySelect.options[0].textContent = w.choose;
      [...categorySelect.options].slice(1).forEach((option) => { option.textContent = categoryNames[language][option.value]; });
    }
    $$('header nav button').forEach((button) => button.setAttribute("aria-pressed", String(button.lang === language)));
    updateRegionButtons();
    renderFeed();
  }

  function updateRegionButtons() {
    const buttons = $$(`[aria-labelledby='region-heading'] [role='group'] button`);
    buttons.forEach((button, index) => {
      const region = index === 0 ? "jeonju" : "tokyo";
      button.textContent = language === "ko" ? locales[region].name : (region === "jeonju" ? "全州" : "東京");
      button.dataset.region = region;
      button.setAttribute("aria-pressed", String(currentRegion === region));
    });
  }

  /* 폼을 처음에는 접어 두고, 지도에서 위치를 고르면 펼칩니다. */
  function openForm(location) {
    draftLocation = location;
    if (draftMarker) draftMarker.remove();
    if (location && map) {
      draftMarker = L.marker([location.lat, location.lng]).addTo(map);
      draftMarker.bindPopup(words[language].posted).openPopup();
    }
    form.hidden = false;
    const regionSelect = $("#post-region");
    if (regionSelect) regionSelect.value = currentRegion;
    form.scrollIntoView({ behavior: "smooth", block: "center" });
    $("#nickname")?.focus({ preventScroll: true });
  }

  function closeForm() {
    form.hidden = true;
    draftLocation = null;
    if (draftMarker) draftMarker.remove();
    draftMarker = null;
  }

  function escapeText(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }

  /* 카드 요소는 사용자 입력을 HTML로 해석하지 않도록 textContent로 채웁니다. */
  function makeCard(post) {
    const w = words[language];
    const card = document.createElement("article");
    card.className = "post-card";
    card.dataset.postId = post.id;
    card.tabIndex = 0;

    const title = document.createElement("h3");
    title.textContent = `${post.place} · ${post.nickname}`;
    card.append(title);
    const details = document.createElement("p");
    const regionName = language === "ko" ? locales[post.region].name : (post.region === "jeonju" ? "全州" : "東京");
    details.textContent = `${regionName} · ${categoryNames[language][post.category] || post.category}${post.isExample ? ` · ${w.example}` : ""}`;
    card.append(details);
    const story = document.createElement("p");
    story.textContent = post.story;
    card.append(story);
    if (post.photo) {
      const image = document.createElement("img");
      image.src = post.photo;
      image.alt = w.photoAlt;
      image.loading = "lazy";
      image.style.maxWidth = "100%";
      image.style.borderRadius = "12px";
      card.append(image);
    }

    const actions = document.createElement("div");
    actions.className = "post-actions";
    const like = document.createElement("button");
    like.type = "button";
    like.dataset.action = "like";
    like.textContent = `💙 ${w.like} (${post.likes || 0})`;
    actions.append(like);
    const reaction = document.createElement("button");
    reaction.type = "button";
    reaction.dataset.action = "reaction";
    reaction.textContent = `${(post.reactions || []).join(" ") || "😊"} +`;
    reaction.setAttribute("aria-label", language === "ko" ? "이모티콘 반응 추가" : "絵文字リアクションを追加");
    actions.append(reaction);
    const commentButton = document.createElement("button");
    commentButton.type = "button";
    commentButton.dataset.action = "comment";
    commentButton.textContent = `💬 ${w.comment} (${(post.comments || []).length})`;
    actions.append(commentButton);
    if (!post.isExample) {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.dataset.action = "delete";
      remove.textContent = w.remove;
      actions.append(remove);
    }
    card.append(actions);

    if (post.comments?.length) {
      const commentList = document.createElement("ul");
      commentList.className = "comment-list";
      post.comments.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `${item.nickname}: ${item.text}`;
        commentList.append(li);
      });
      card.append(commentList);
    }
    return card;
  }

  /* 선택 지역의 글만 보이며, 마이페이지에서는 현재 닉네임의 글을 모아 봅니다. */
  function renderFeed() {
    const visible = posts.filter((post) => showMine ? post.nickname === currentNickname : post.region === currentRegion);
    feed.replaceChildren();
    if (!visible.length) {
      const empty = document.createElement("p");
      empty.textContent = words[language].empty;
      feed.append(empty);
      return;
    }
    visible.forEach((post) => feed.append(makeCard(post)));
  }

  /* 기존 글 위치와 현재 선택 지역에 맞춰 지도의 핀을 다시 그립니다. */
  function renderMarkers() {
    if (!map) return;
    markers.forEach((marker) => marker.remove());
    markers = [];
    posts.filter((post) => post.region === currentRegion && Number.isFinite(post.lat) && Number.isFinite(post.lng)).forEach((post) => {
      const marker = L.marker([post.lat, post.lng]).addTo(map);
      marker.bindPopup(`<strong>${escapeText(post.place)}</strong><br>${escapeText(post.nickname)}`);
      marker.on("click", () => {
        const card = $(`[data-post-id="${CSS.escape(post.id)}"]`, feed);
        if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      markers.push(marker);
    });
  }

  function switchRegion(region) {
    if (!locales[region]) return;
    currentRegion = region;
    showMine = false;
    updateRegionButtons();
    map.setView(locales[region].center, locales[region].zoom);
    renderMarkers();
    renderFeed();
    if (!form.hidden) {
      const selector = $("#post-region");
      if (selector) selector.value = region;
    }
  }

  /* Leaflet 지도를 만들고, 지도 클릭 시 새 게시글 작성으로 연결합니다. */
  function initializeMap() {
    if (!window.L) {
      mapElement.textContent = language === "ko" ? "지도를 불러오지 못했어요. 인터넷 연결을 확인해 주세요." : "地図を読み込めませんでした。インターネット接続を確認してください。";
      return;
    }
    map = L.map(mapElement).setView(locales[currentRegion].center, locales[currentRegion].zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    map.on("click", (event) => {
      showMine = false;
      renderFeed();
      openForm({ lat: event.latlng.lat, lng: event.latlng.lng });
    });
    renderMarkers();
  }

  /* 폼에서 선택한 사진을 작게 줄여 브라우저 저장 공간을 아끼고 Data URL로 읽습니다. */
  function readPhoto(file) {
    if (!file) return Promise.resolve("");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const nickname = $("#nickname").value.trim();
    const region = $("#post-region").value;
    const file = $("#photo").files[0];
    let photo = "";
    try { photo = await readPhoto(file); }
    catch (error) { console.warn("사진을 읽지 못했습니다.", error); }
    const newPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      nickname, region, place: $("#place").value.trim(), category: $("#category").value,
      story: $("#story").value.trim(), photo,
      lat: draftLocation?.lat ?? locales[region].center[0],
      lng: draftLocation?.lng ?? locales[region].center[1],
      likes: 0, reactions: [], comments: [], createdAt: new Date().toISOString(), isExample: false
    };
    posts.unshift(newPost);
    currentNickname = nickname;
    try { localStorage.setItem(PROFILE_KEY, nickname); } catch (_) { /* 저장이 차단된 환경에서도 화면은 계속 동작합니다. */ }
    savePosts();
    form.reset();
    closeForm();
    switchRegion(region);
    renderMarkers();
    renderFeed();
  });

  /* 피드의 버튼은 이벤트 위임으로 처리해 카드마다 별도 이벤트를 달지 않습니다. */
  feed.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    const card = event.target.closest("[data-post-id]");
    if (!card) return;
    if (!button) {
      const selectedPost = posts.find((item) => item.id === card.dataset.postId);
      if (selectedPost && map && Number.isFinite(selectedPost.lat) && Number.isFinite(selectedPost.lng)) {
        switchRegion(selectedPost.region);
        map.setView([selectedPost.lat, selectedPost.lng], 16);
      }
      return;
    }
    const post = posts.find((item) => item.id === card.dataset.postId);
    if (!post) return;
    const action = button.dataset.action;
    if (action === "like") post.likes = (post.likes || 0) + 1;
    if (action === "reaction") {
      const options = ["💙", "😊", "☕", "🌿", "😋", "📚", "🎉"];
      const choice = prompt(language === "ko" ? `반응 이모티콘을 골라주세요: ${options.join(" ")}` : `絵文字を選んでください: ${options.join(" ")}`, "💙");
      if (choice) post.reactions = [...(post.reactions || []), choice.slice(0, 8)];
    }
    if (action === "comment") {
      const text = prompt(words[language].commentPrompt);
      if (text?.trim()) post.comments = [...(post.comments || []), { nickname: currentNickname || (language === "ko" ? "이웃" : "ご近所さん"), text: text.trim() }];
    }
    if (action === "delete") {
      if (!confirm(words[language].deleteConfirm)) return;
      posts = posts.filter((item) => item.id !== post.id);
    }
    savePosts();
    renderFeed();
    renderMarkers();
  });

  /* 카드의 나머지 영역을 누르면 지도에서 해당 게시글 위치를 보여줍니다. */
  feed.addEventListener("dblclick", (event) => {
    const card = event.target.closest("[data-post-id]");
    if (!card) return;
    const post = posts.find((item) => item.id === card.dataset.postId);
    if (post && map && Number.isFinite(post.lat) && Number.isFinite(post.lng)) {
      switchRegion(post.region);
      map.setView([post.lat, post.lng], 16);
    }
  });

  $$('header nav button').forEach((button) => button.addEventListener("click", () => {
    language = button.lang === "ja" ? "ja" : "ko";
    applyLanguage();
  }));

  $$(`[aria-labelledby='region-heading'] [role='group'] button`).forEach((button, index) => {
    button.addEventListener("click", () => switchRegion(button.dataset.region || (index === 0 ? "jeonju" : "tokyo")));
  });

  $("#mypage-button")?.addEventListener("click", () => {
    if (showMine) {
      showMine = false;
      renderFeed();
      applyLanguage();
      return;
    }
    const savedName = (() => { try { return localStorage.getItem(PROFILE_KEY) || ""; } catch (_) { return ""; } })();
    const name = prompt(words[language].askNickname, currentNickname || savedName);
    if (!name?.trim()) return;
    currentNickname = name.trim();
    try { localStorage.setItem(PROFILE_KEY, currentNickname); } catch (_) { /* 선택 기능 */ }
    showMine = true;
    renderFeed();
    applyLanguage();
  });

  /* 폼을 지역 전환 버튼과 별도로 열 수 있도록 제목을 누르면 엽니다. */
  $("#write-heading")?.addEventListener("click", () => openForm(null));
  currentNickname = (() => { try { return localStorage.getItem(PROFILE_KEY) || ""; } catch (_) { return ""; } })();
  form.hidden = true;
  applyLanguage();
  initializeMap();
})();
