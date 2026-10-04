/* 하루핀의 지도, 장소 검색, 피드, 글쓰기 기능을 연결합니다. */
(() => {
  "use strict";

  const STORAGE_KEY = "harupin-data-v1";
  const PROFILE_KEY = "harupin-nickname-v1";
  const ACCOUNT_KEY = "harupin-demo-account-v1";
  const ACCOUNTS_KEY = "harupin-demo-accounts-v1";
  const SESSION_KEY = "harupin-demo-session-v1";
  const LANGUAGE_KEY = "harupin-language-v1";
  const PROFILES_KEY = "harupin-profiles-v1";
  const LIKES_KEY = "harupin-likes-v1";
  const FOLLOWS_KEY = "harupin-follows-v1";
  const DIARIES_KEY = "harupin-diaries-v1";
  const NOTIFICATIONS_KEY = "harupin-notifications-v1";
  const REPORTS_KEY = "harupin-reports-v1";
  const BLOCKS_KEY = "harupin-blocks-v1";
  const BOOKMARKS_KEY = "harupin-bookmarks-v1";
  const TUTORIAL_KEY = "harupin-tutorial-seen-v1";
  const locales = {
    jeonju: { name: { ko: "전주", ja: "全州" }, center: [35.8467, 127.1296], zoom: 14 },
    tokyo: { name: { ko: "도쿄", ja: "東京" }, center: [35.6812, 139.7671], zoom: 13 }
  };
  const categories = {
    ko: { school: "학교 생활", cafe: "동네 카페", food: "숨은 맛집", walk: "산책로" },
    ja: { school: "学校生活", cafe: "近所のカフェ", food: "隠れた名店", walk: "散歩道" }
  };
  const categoryColors = { school: "#8B68C8", cafe: "#D58A36", food: "#E35B5B", walk: "#4AAB78" };
  const text = {
    ko: {
      appTitle: "Haru Pin ハルピン", tagline: "하루의 장소와 이야기를 잇다", languageHeading: "언어 설정", loginHeading: "로그인",
      profileBack: "← 뒤로", joinedAt: "가입일", residenceLabel: "거주지", postsCount: "게시글", followers: "팔로워", following: "팔로잉", follow: "팔로우", followed: "팔로잉 ✓", unfollowConfirm: "팔로우를 취소할까요?", noFollowList: "아직 목록이 없어요.", noJoinedDate: "정보 없음", profilePosts: "게시글",
      login: "로그인", signup: "처음이에요 / 회원가입", nickname: "닉네임", password: "비밀번호",
      loginNamePlaceholder: "아이디를 입력하세요", passwordPlaceholder: "비밀번호를 입력하세요", passwordConfirm: "비밀번호 확인", share: "공유", shareCount: "공유", detailComments: "댓글", commentInput: "댓글을 입력하세요", commentSubmit: "댓글 등록", detailClose: "닫기", attachPhoto: "사진 첨부", removePhoto: "첨부 사진 삭제", commentPhotoAlt: "댓글 사진", commentPhotoPreview: "첨부 사진 미리보기", commentRequired: "글이나 사진을 첨부해주세요.", commentSaveError: "저장 공간이 부족해요. 사진 수를 줄여주세요.", commentEmpty: "글이나 사진을 첨부해주세요.",
      idRule: "영문 소문자와 숫자 4~16자, 영문으로 시작 · 다른 사용자와 중복 불가", idInvalid: "영문 소문자와 숫자만, 영문으로 시작하는 4~16자로 입력해주세요.", idDuplicate: "이미 사용 중인 아이디예요.", idValid: "사용할 수 있는 아이디예요.", passwordRule: "8~20자, 영문과 숫자 포함, 공백 없이 · 아이디와 다르게 입력", passwordInvalid: "8~20자이며 영문과 숫자를 포함하고 공백이 없어야 해요.", passwordSameId: "아이디와 다른 비밀번호를 입력해주세요.", passwordValid: "사용할 수 있는 비밀번호예요.", passwordConfirmHint: "비밀번호를 한 번 더 입력해주세요.", passwordMismatch: "비밀번호가 일치하지 않아요.", passwordMatch: "비밀번호가 일치해요.", signupReady: "가입 조건을 모두 확인해주세요.", signupFieldsInvalid: "아이디와 비밀번호 조건을 확인해주세요.",
      demoNote: "현재는 이 브라우저에만 계정 정보가 저장됩니다.", logout: "로그아웃",
      accountMissing: "계정이 없어요. 회원가입을 먼저 해주세요.", loginFailed: "닉네임 또는 비밀번호를 확인해주세요.",
      accountExists: "이미 가입된 아이디예요. 로그인해주세요.", signupDone: "가입이 완료됐어요. 환영합니다!",
      storageError: "브라우저 저장소를 사용할 수 없어요. 브라우저 설정을 확인해주세요.",
      feed: "피드", mine: "마이페이지", all: "지역 피드 보기", write: "동네 이야기 나누기",
      feedAll: "전체", feedJeonju: "전주", feedTokyo: "도쿄", sortNewest: "최신순", sortPopular: "인기순", feedRegionLabel: "도시별 피드", feedSortLabel: "피드 정렬", categoryMapFilterLabel: "지도 카테고리 필터", mapPost: "지도에서 보기", loadMore: "더 보기", postDateLabel: "작성일",
      diary: "내 일기", diaryToggle: "📔 내 일기", diaryToggleMobile: "📔 내 일기 쓰기", diaryDone: "✓ 오늘 완료", diaryIntro: "오늘의 일기를 남겨보세요", diaryMine: "내 일기", diaryFollowing: "팔로잉 일기", diaryMap: "🗺 일기 지도", diaryPrivacy: "🔒 일기는 나를 팔로우하는 사람에게만 보여요. 일기 위치도 본인과 팔로워에게만 공개돼요.", diaryTitle: "제목 (선택)", diaryMood: "오늘의 기분", diaryBody: "오늘의 일기", diaryPhoto: "사진 1장 (선택)", diaryLocation: "📍 장소 추가 (선택)", diaryLocationSearch: "장소 검색 (Nominatim)", diaryLocationSearchButton: "검색", diaryLocationSearchPlaceholder: "장소 이름을 검색하세요", diaryLocationLoading: "장소를 찾고 있어요…", diaryLocationEmpty: "장소를 찾지 못했어요.", diaryLocationError: "장소를 검색하지 못했어요. 잠시 후 다시 시도해 주세요.", diaryLocationMapLabel: "지도를 클릭해 일기 위치를 선택", diaryLocationRemove: "장소 삭제", diaryLocationSelected: "선택한 위치", diaryLocationAt: (lat, lng) => `지도에서 선택 (${lat.toFixed(5)}, ${lng.toFixed(5)})`, diaryMapPrivacy: "나와 내가 팔로우하는 사람의 일기 위치만 표시됩니다.", diaryMapEmpty: "표시할 일기 장소가 아직 없어요.", diaryMapPopup: (date, author, mood, body) => `<strong>${date}</strong><br>${author} · ${mood}<br>${body}`, diaryLocationLink: (name) => `📍 ${name}`, diaryWrite: "오늘의 일기 쓰기", diarySave: "일기 저장", diaryUpdate: "수정 완료", diaryCancel: "취소", diaryDelete: "삭제", diaryEdit: "수정", diaryTodayExists: "오늘의 일기를 이미 썼어요 ✨ 내일 또 만나요", diaryDeleteConfirm: "일기를 삭제할까요? 삭제한 뒤 오늘 다시 쓸 수 없어요.", diaryEmpty: "아직 쓴 일기가 없어요.", diaryFollowingEmpty: "팔로잉 중인 사람의 일기가 아직 없어요.", diaryFollowRequired: "팔로우하면 일기를 볼 수 있어요 🔒", diaryMutual: "🤝 서로 이웃", diaryHeart: "하트", diaryComment: "댓글", diaryCommentPlaceholder: "짧은 댓글을 남겨주세요 (100자)", diaryCommentSubmit: "등록", diaryPhotoRemove: "사진 삭제", diaryStreak: (count) => `🔥 ${count}일 연속`, diaryCalendar: "달력", diaryList: "목록", diaryNoToday: "오늘은 아직 일기를 쓰지 않았어요.", diaryPhotoError: "사진을 읽지 못했어요.", diaryImageAlt: "일기 사진",
      welcomeGreeting: (nickname) => `안녕하세요, ${nickname}님! 오늘은 어떤 하루였나요?`, welcomeTotal: "전체 글", welcomeToday: "오늘 올라온 글", welcomeStart: "시작하기", homeLogo: "Haru Pin 홈", welcomeMapLabel: "한국과 일본의 피드 지도",
      residence: "거주 지역", place: "장소 이름", category: "카테고리",
      photo: "사진", story: "짧은 글", choose: "선택하세요", submit: "게시글 올리기",
      like: "좋아요", comment: "댓글", remove: "삭제", example: "예시", empty: "아직 게시글이 없습니다.", noPosts: "아직 피드 글이 없어요. 첫 게시글을 남겨보세요! ✨",
      searchPlaceholder: "카페, 맛집, 관광지 검색", searchButton: "검색", noResults: "검색 결과가 없어요", searchReset: "전체로 돌아가기", searchResultLabel: "게시글 검색 결과", categoryFilterLabel: "카테고리 검색", categoryLegendLabel: "카테고리별 핀 색상", categoryAll: "전체", searchResultMeta: "작성자",
      deleteCommentConfirm: "댓글을 삭제할까요?", deleteCommentPhotoConfirm: "사진만 삭제할까요?", deleteComment: "삭제", deleteCommentPhoto: "사진만 삭제",
      searchError: "검색 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.", searching: "장소를 찾고 있어요…",
      askNickname: "내 게시글을 모아볼 닉네임을 입력하세요.", commentPrompt: "댓글을 입력하세요.",
      deleteConfirm: "이 게시글을 삭제할까요?", mapLabel: "하루핀 피드 지도", searchLabel: "장소 검색",
      compose: "새 게시글 작성", close: "닫기", searchAt: "검색한 장소", postAt: "게시글 위치",
      reaction: "이모티콘 반응 추가", photoAlt: "게시글 사진", saveError: "저장 공간이 부족해요. 사진 크기를 줄여 주세요.",
      profile: "프로필", setup: "프로필 설정", start: "시작하기", edit: "프로필 수정", backMap: "← 지도로 돌아가기", myPosts: "내 포스트", myComments: "내 댓글", likesTab: "좋아요", save: "저장", nicknameRequired: "닉네임을 입력해주세요", nicknameLength: "닉네임은 2~12자로 입력해주세요.", nicknameTaken: "이미 사용 중인 닉네임이에요.", noProfileItems: "아직 표시할 내용이 없어요.", profilePhoto: "프로필 사진 (선택)", commentOn: "댓글을 단 글", delete: "삭제", profilePhotoAlt: "프로필 사진", photoPreviewAlt: "프로필 사진 미리보기", profileTabsLabel: "프로필 게시물", consentTerms: "[필수] 이용약관 동의", consentPrivacy: "[필수] 개인정보 수집·이용 동의", consentAge: "[필수] 만 14세 이상입니다", missingConsent: "필수 항목에 모두 동의해주세요.", consentAll: "전체 동의", viewFull: "전문 보기", postingWarning: "타인의 얼굴이나 개인정보가 보이는 사진은 올리지 마세요. 올린 글의 책임은 작성자에게 있습니다.", policies: "약관 및 정책", withdraw: "회원 탈퇴", withdrawTitle: "회원 탈퇴 안내", withdrawWarning: "탈퇴하면 아래 정보가 즉시 삭제되고 복구할 수 없어요.", withdrawItems: "삭제되는 정보: 계정, 프로필, 내가 쓴 글·사진·댓글·일기·일기 위치, 반응과 팔로우 기록", withdrawCheck: "위 내용을 모두 확인했습니다", withdrawPassword: "비밀번호 재입력 (본인 확인)", cancel: "취소", withdrawSubmit: "탈퇴하기", withdrawWrong: "비밀번호를 확인해주세요.", withdrawDone: "탈퇴가 완료됐어요",       policyNotice: "※ 이 문서는 시제품용 임시 초안입니다. 정식 서비스 전에 전문가 검토가 필요합니다.", policyTerms: "이용약관", policyPrivacy: "개인정보 처리방침", policyContent: "콘텐츠 저작권", policyLicense: "오픈소스·지도 라이선스", postingAgree: "게시하려면 안내를 확인하고 동의해주세요.",
      savedTab: "저장한 글", saved: "저장", unsaved: "저장됨 ✓", savedEmpty: "아직 저장한 글이 없어요. 마음에 드는 글을 저장해보세요! 🔖", editPost: "수정", edited: "(수정됨)", report: "🚩 신고", block: "차단", unblock: "차단 해제", blocked: "차단한 사용자", noBlocked: "차단한 사용자가 없어요.", reportTitle: "신고 사유를 선택해주세요", reportSubmit: "신고 접수", reportDone: "신고가 접수됐어요.", reportDuplicate: "이미 신고한 항목이에요.", reportOwn: "내 콘텐츠는 신고할 수 없어요.", reasonAbuse: "욕설", reasonIllegal: "불법 촬영물", reasonPrivacy: "개인정보 노출", reasonAdvertising: "광고", reasonOther: "기타", hiddenPost: "신고가 접수되어 숨겨진 글입니다.", blockedEmpty: "차단한 사용자예요.", blockConfirm: "이 사용자를 차단할까요? 서로의 팔로우가 해제됩니다.", unblockConfirm: "차단을 해제할까요?", noComments: "아직 댓글이 없어요. 첫 댓글을 남겨보세요! 💬", noPosts: "아직 피드 글이 없어요. 첫 게시글을 남겨보세요! ✨", noFollowing: "아직 팔로잉이 없어요. 마음에 드는 이웃을 찾아보세요! 🌱", translate: "번역", original: "원문 보기", translating: "번역 중…", translationFailed: "번역하지 못했어요.", titleLimit: "제목은 50자까지 입력할 수 있어요.", storyLimit: "본문은 1000자까지 입력할 수 있어요.", charsRemaining: (count) => `${count}자 남음`, spamBlocked: "같은 내용의 글을 반복해서 게시할 수 없어요.", notificationTitle: "알림", readAll: "모두 읽음", noNotifications: "새 알림이 없어요.", notificationLike: (name) => `${name}님이 내 글을 좋아합니다.`, notificationComment: (name) => `${name}님이 내 글에 댓글을 남겼어요.`, notificationFollow: (name) => `${name}님이 나를 팔로우하기 시작했어요.`, notificationDiary: (name) => `${name}님이 새 일기를 썼어요.`, tutorialHelp: "도움말 다시 보기", tutorialSkip: "다시 보지 않기", tutorialNext: "다음", tutorialPrev: "이전", tutorialDone: "시작하기", tutorialSlides: [{ title: "지도에 핀을 남겨보세요 📍", description: "장소를 골라 공개 피드에 오늘의 이야기와 사진을 공유해요." }, { title: "팔로우하고 일기를 나눠요 🤝", description: "팔로워 전용 일기는 서로 팔로우한 사람들과 더 가까이 나눌 수 있어요." }, { title: "번역으로 마음을 나눠요 🌏", description: "피드 글과 댓글을 번역해 전주와 도쿄의 이야기를 읽어보세요." }], reportPolicy: "욕설, 불법 촬영물, 개인정보 노출, 광고 등은 신고할 수 있으며, 게시글은 3회 신고 시 검토를 위해 자동으로 숨겨집니다.",
      translationConsent: "번역을 위해 선택한 글과 댓글 내용이 MyMemory 번역 API로 전송됩니다. 계속할까요?"
    },
    ja: {
      appTitle: "Haru Pin ハルピン", tagline: "一日の場所と思い出をつなぐ", languageHeading: "言語設定", loginHeading: "ログイン",
      profileBack: "← 戻る", joinedAt: "登録日", residenceLabel: "居住地", postsCount: "投稿", followers: "フォロワー", following: "フォロー中", follow: "フォロー", followed: "フォロー中 ✓", unfollowConfirm: "フォローを解除しますか？", noFollowList: "リストはまだありません。", noJoinedDate: "情報なし", profilePosts: "投稿",
      login: "ログイン", signup: "初めての方 / 新規登録", nickname: "ニックネーム", password: "パスワード",
      loginNamePlaceholder: "IDを入力", passwordPlaceholder: "パスワードを入力", passwordConfirm: "パスワードの確認", share: "共有", shareCount: "共有", detailComments: "コメント", commentInput: "コメントを入力", commentSubmit: "コメントを投稿", detailClose: "閉じる", attachPhoto: "写真を添付", removePhoto: "添付写真を削除", commentPhotoAlt: "コメント写真", commentPhotoPreview: "添付写真のプレビュー", commentRequired: "文章または写真を添付してください。", commentSaveError: "保存容量が不足しています。写真の数を減らしてください。", commentEmpty: "文章または写真を添付してください。",
      idRule: "半角英小文字と数字で4〜16文字、英字で開始 · 他の利用者と重複不可", idInvalid: "英小文字で始まる4〜16文字の英数字を入力してください。", idDuplicate: "このIDはすでに使われています。", idValid: "このIDは使用できます。", passwordRule: "8〜20文字、英字と数字を含む、空白不可 · IDと異なるもの", passwordInvalid: "8〜20文字で英字と数字を含め、空白は使えません。", passwordSameId: "IDと異なるパスワードを入力してください。", passwordValid: "このパスワードは使用できます。", passwordConfirmHint: "パスワードをもう一度入力してください。", passwordMismatch: "パスワードが一致しません。", passwordMatch: "パスワードが一致しました。", signupReady: "登録条件をすべて確認してください。", signupFieldsInvalid: "IDとパスワードの条件を確認してください。",
      demoNote: "アカウント情報はこのブラウザー内にのみ保存されます。", logout: "ログアウト",
      accountMissing: "アカウントがありません。先に新規登録してください。", loginFailed: "ニックネームまたはパスワードを確認してください。",
      accountExists: "このIDは登録済みです。ログインしてください。", signupDone: "登録が完了しました。ようこそ！",
      storageError: "ブラウザーの保存領域を利用できません。設定を確認してください。",
      feed: "フィード", mine: "マイページ", all: "地域の投稿を見る", write: "街の話をシェア",
      feedAll: "すべて", feedJeonju: "全州", feedTokyo: "東京", sortNewest: "新着順", sortPopular: "人気順", feedRegionLabel: "都市別フィード", feedSortLabel: "並べ替え", categoryMapFilterLabel: "地図のカテゴリー絞り込み", mapPost: "地図で見る", loadMore: "もっと見る", postDateLabel: "投稿日",
      diary: "マイ日記", diaryToggle: "📔 マイ日記", diaryToggleMobile: "📔 マイ日記を書く", diaryDone: "✓ 今日完了", diaryIntro: "今日の日記を書いてみましょう", diaryMine: "自分の日記", diaryFollowing: "フォロー中の日記", diaryMap: "🗺 日記マップ", diaryPrivacy: "🔒 日記は自分をフォローしている人だけに表示されます。日記の位置情報も本人とフォロワーだけに公開されます。", diaryTitle: "タイトル（任意）", diaryMood: "今日の気分", diaryBody: "今日の日記", diaryPhoto: "写真1枚（任意）", diaryLocation: "📍 場所を追加（任意）", diaryLocationSearch: "場所を検索（Nominatim）", diaryLocationSearchButton: "検索", diaryLocationSearchPlaceholder: "場所の名前を検索", diaryLocationLoading: "場所を検索しています…", diaryLocationEmpty: "場所が見つかりませんでした。", diaryLocationError: "場所を検索できませんでした。しばらくしてからもう一度お試しください。", diaryLocationMapLabel: "地図をクリックして日記の場所を選択", diaryLocationRemove: "場所を削除", diaryLocationSelected: "選択した場所", diaryLocationAt: (lat, lng) => `地図で選択 (${lat.toFixed(5)}, ${lng.toFixed(5)})`, diaryMapPrivacy: "自分と自分がフォローしている人の日記の場所だけが表示されます。", diaryMapEmpty: "表示できる日記の場所はまだありません。", diaryMapPopup: (date, author, mood, body) => `<strong>${date}</strong><br>${author} · ${mood}<br>${body}`, diaryLocationLink: (name) => `📍 ${name}`, diaryWrite: "今日の日記を書く", diarySave: "日記を保存", diaryUpdate: "更新", diaryCancel: "キャンセル", diaryDelete: "削除", diaryEdit: "編集", diaryTodayExists: "今日の日記はもう書きました ✨ また明日！", diaryDeleteConfirm: "日記を削除しますか？削除後、今日は書き直せません。", diaryEmpty: "日記はまだありません。", diaryFollowingEmpty: "フォロー中の人の日記はまだありません。", diaryFollowRequired: "フォローすると日記を読めます 🔒", diaryMutual: "🤝 相互フォロー", diaryHeart: "ハート", diaryComment: "コメント", diaryCommentPlaceholder: "短いコメントを書く（100文字）", diaryCommentSubmit: "送信", diaryPhotoRemove: "写真を削除", diaryStreak: (count) => `🔥 ${count}日連続`, diaryCalendar: "カレンダー", diaryList: "リスト", diaryNoToday: "今日はまだ日記を書いていません。", diaryPhotoError: "写真を読み込めませんでした。", diaryImageAlt: "日記の写真",
      welcomeGreeting: (nickname) => `こんにちは、${nickname}さん！今日はどんな一日でしたか？`, welcomeTotal: "全投稿", welcomeToday: "今日の投稿", welcomeStart: "始める", homeLogo: "Haru Pin ホーム", welcomeMapLabel: "韓国と日本のフィードマップ",
      residence: "居住地", place: "場所", category: "カテゴリー",
      photo: "写真", story: "ひとこと", choose: "選択してください", submit: "投稿する",
      like: "いいね", comment: "コメント", remove: "削除", example: "サンプル", empty: "投稿はまだありません。", noPosts: "フィード投稿はまだありません。最初の投稿を残してみましょう！ ✨",
      searchPlaceholder: "カフェ、グルメ、観光地を検索", searchButton: "検索", noResults: "検索結果がありません", searchReset: "すべてに戻る", searchResultLabel: "投稿の検索結果", categoryFilterLabel: "カテゴリー検索", categoryLegendLabel: "カテゴリー別ピンの色", categoryAll: "すべて", searchResultMeta: "投稿者",
      deleteCommentConfirm: "コメントを削除しますか？", deleteCommentPhotoConfirm: "写真だけを削除しますか？", deleteComment: "削除", deleteCommentPhoto: "写真だけ削除",
      searchError: "検索中に問題が発生しました。しばらくしてから再度お試しください。", searching: "場所を検索しています…",
      askNickname: "自分の投稿を見るニックネームを入力してください。", commentPrompt: "コメントを入力してください。",
      deleteConfirm: "この投稿を削除しますか？", mapLabel: "ハルピンのフィードマップ", searchLabel: "場所を検索",
      compose: "新しい投稿を作成", close: "閉じる", searchAt: "検索した場所", postAt: "投稿の場所",
      reaction: "絵文字リアクションを追加", photoAlt: "投稿の写真", saveError: "保存容量が不足しています。写真を小さくしてください。",
      profile: "プロフィール", setup: "プロフィール設定", start: "始める", edit: "プロフィールを編集", backMap: "← 地図に戻る", myPosts: "自分の投稿", myComments: "自分のコメント", likesTab: "いいね", save: "保存", nicknameRequired: "ニックネームを入力してください", nicknameLength: "ニックネームは2〜12文字で入力してください。", nicknameTaken: "このニックネームは使用されています。", noProfileItems: "表示する内容はまだありません。", profilePhoto: "プロフィール写真（任意）", commentOn: "コメントした投稿", delete: "削除", profilePhotoAlt: "プロフィール写真", photoPreviewAlt: "プロフィール写真のプレビュー", profileTabsLabel: "プロフィールの投稿", consentTerms: "[必須] 利用規約に同意", consentPrivacy: "[必須] 個人情報の収集・利用に同意", consentAge: "[必須] 14歳以上です", missingConsent: "必須項目すべてに同意してください。", consentAll: "すべてに同意", viewFull: "全文を見る", postingWarning: "他人の顔や個人情報が写った写真は投稿しないでください。投稿の責任は投稿者にあります。", policies: "規約とポリシー", withdraw: "退会する", withdrawTitle: "退会のご案内", withdrawWarning: "退会すると、以下の情報はすぐに削除され、元に戻せません。", withdrawItems: "削除される情報：アカウント、プロフィール、自分の投稿・写真・コメント・日記・日記の位置情報、リアクションとフォロー履歴", withdrawCheck: "上記をすべて確認しました", withdrawPassword: "パスワードを再入力（本人確認）", cancel: "キャンセル", withdrawSubmit: "退会する", withdrawWrong: "パスワードを確認してください。", withdrawDone: "退会が完了しました",       policyNotice: "※ この文書は試作版の仮草案です。正式サービスの前に専門家による確認が必要です。", policyTerms: "利用規約", policyPrivacy: "個人情報保護方針", policyContent: "コンテンツの著作権", policyLicense: "オープンソース・地図ライセンス", postingAgree: "投稿するには案内を確認して同意してください。",
      savedTab: "保存した投稿", saved: "保存", unsaved: "保存済み ✓", savedEmpty: "保存した投稿はまだありません。気になる投稿を保存してみましょう！ 🔖", editPost: "編集", edited: "(編集済み)", report: "🚩 報告", block: "ブロック", unblock: "ブロック解除", blocked: "ブロック中のユーザー", noBlocked: "ブロック中のユーザーはいません。", reportTitle: "報告理由を選択してください", reportSubmit: "報告する", reportDone: "報告を受け付けました。", reportDuplicate: "この項目はすでに報告されています。", reportOwn: "自分のコンテンツは報告できません。", reasonAbuse: "暴言", reasonIllegal: "違法な盗撮画像", reasonPrivacy: "個人情報の漏えい", reasonAdvertising: "広告", reasonOther: "その他", hiddenPost: "報告を受け付けたため、この投稿は非表示になっています。", blockedEmpty: "ブロック中のユーザーです。", blockConfirm: "このユーザーをブロックしますか？相互のフォローは解除されます。", unblockConfirm: "ブロックを解除しますか？", noComments: "コメントはまだありません。最初のコメントをどうぞ！ 💬", noPosts: "フィード投稿はまだありません。最初の投稿を残してみましょう！ ✨", noFollowing: "フォロー中の人はいません。気になる人を見つけましょう！ 🌱", translate: "翻訳", original: "原文を見る", translating: "翻訳中…", translationFailed: "翻訳できませんでした。", titleLimit: "タイトルは50文字まで入力できます。", storyLimit: "本文は1000文字まで入力できます。", charsRemaining: (count) => `残り${count}文字`, spamBlocked: "同じ内容の投稿を繰り返すことはできません。", notificationTitle: "通知", readAll: "すべて既読", noNotifications: "新しい通知はありません。", notificationLike: (name) => `${name}さんが投稿にいいねしました。`, notificationComment: (name) => `${name}さんが投稿にコメントしました。`, notificationFollow: (name) => `${name}さんがフォローしました。`, notificationDiary: (name) => `${name}さんが新しい日記を書きました。`, tutorialHelp: "ヘルプをもう一度見る", tutorialSkip: "次回から表示しない", tutorialNext: "次へ", tutorialPrev: "戻る", tutorialDone: "始める", tutorialSlides: [{ title: "地図にピンを残しましょう 📍", description: "場所を選び、公開フィードに今日の話や写真を共有しましょう。" }, { title: "フォローして日記を共有 🤝", description: "フォロワー限定の日記は相互フォローの人と分かち合えます。" }, { title: "翻訳で気持ちを共有 🌏", description: "フィード投稿やコメントを翻訳して、全州と東京の話を読みましょう。" }], reportPolicy: "暴言、違法な盗撮画像、個人情報の漏えい、広告などを報告できます。投稿は3回報告されると確認のため自動的に非表示になります。",
      translationConsent: "翻訳のため、選択した投稿やコメントの内容がMyMemory翻訳APIに送信されます。続けますか？"
    }
  };
  const examples = [
    { id: "ex-j-1", nickname: "하루", region: "jeonju", place: "전북대학교 구정문", category: "cafe", story: "수업 끝나고 들르기 좋은 조용한 카페예요. 창가 자리가 특히 좋아요!", lat: 35.8462, lng: 127.1298, reactions: ["☕", "💙"], likes: 8, createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), comments: [{ nickname: "민지", text: "다음에 같이 가요!" }] },
    { id: "ex-j-2", nickname: "민지", region: "jeonju", place: "객리단길", category: "food", story: "골목마다 작은 가게가 많아서 구경하는 재미가 있어요. 저녁 산책 추천!", lat: 35.8176, lng: 127.1394, reactions: ["💙"], likes: 12, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), comments: [] },
    { id: "ex-j-3", nickname: "도윤", region: "jeonju", place: "전북대학교 중앙도서관", category: "school", story: "시험 기간에 공부하기 좋은 자리와 주변 산책 코스를 공유해요.", lat: 35.8469, lng: 127.1291, reactions: ["📚"], likes: 5, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), comments: [] },
    { id: "ex-t-1", nickname: "ゆい", region: "tokyo", place: "上野公園", category: "walk", story: "朝の散歩にぴったり。木陰が多くて、ゆっくり過ごせます。", lat: 35.7156, lng: 139.7745, reactions: ["🌿", "💙"], likes: 10, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), comments: [] },
    { id: "ex-t-2", nickname: "そら", region: "tokyo", place: "神保町の小さな喫茶店", category: "cafe", story: "古本屋めぐりの休憩におすすめ。落ち着いた雰囲気でした。", lat: 35.6958, lng: 139.7575, reactions: ["☕"], likes: 7, createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), comments: [{ nickname: "ゆい", text: "行ってみたいです！" }] },
    { id: "ex-t-3", nickname: "あお", region: "tokyo", place: "谷中銀座", category: "food", story: "食べ歩きが楽しい商店街。夕方の景色もきれいでした。", lat: 35.7278, lng: 139.7667, reactions: ["😋"], likes: 9, createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), comments: [] }
  ];

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const mapElement = $("#map");
  const feed = $("#post-list");
  const feedSheet = $("#feed-sheet");
  const form = $("#post-form");
  const composePanel = $("#compose-panel");
  const searchForm = $("#place-search");
  if (!mapElement || !feed || !form) return;

  function readLanguage() {
    try { return localStorage.getItem(LANGUAGE_KEY) === "ja" ? "ja" : "ko"; }
    catch (_) { return "ko"; }
  }

  let language = readLanguage();
  let currentRegion = "jeonju";
  let showMine = false;
  let feedRegionFilter = "all";
  let feedSort = "newest";
  let feedPostLimit = 10;
  let categoryFilter = "all";
  let activeSearchPostIds = null;
  let currentNickname = "";
  let currentUserId = "";
  let activeProfileTab = "posts";
  let viewingProfileId = "";
  let profileHistory = [];
  let profileOrigin = { kind: "map" };
  let detailBackToProfile = false;
  let registrationMode = false;
  let activeDetailPostId = "";
  let pendingSignupProfile = false;
  let postEditId = "";
  let reportTarget = null;
  let tutorialIndex = 0;
  let translationConsentGranted = false;
  let profilePhotoDraft = "";
  let commentPhotoDraft = "";
  let draftLocation = null;
  let draftMarker = null;
  let searchMarker = null;
  let map;
  let welcomeMap;
  let welcomePostLayer;
  let diaryPhotoDraft = "";
  let diaryLocationDraft = null;
  let diaryLocationPickerMap = null;
  let diaryLocationPickerMarker = null;
  let diaryLocationSearchRequest = null;
  let diaryMap = null;
  let diaryMapLayer = null;
  let diaryMapMarkers = new Map();
  let diaryFormInitialized = false;
  let diaryFormDateKey = "";
  let editingDiaryId = "";
  let activeDiaryTab = "mine";
  let diaryViewMode = "list";
  let diaryMonth = getDiaryDate().slice(0, 7);
  let diaryMidnightTimer;
  let markers = [];
  let posts = loadPosts();
  let lastSearchResults = [];
  let searchRequest;
  let lastSearchTime = 0;
  let pendingSharedPostId = new URLSearchParams(window.location.search).get("post");

  /* 데모 계정 읽기, 가입, 로그인, 로그아웃을 한곳에 모읍니다.
     Firebase로 교체할 때 이 함수들을 새 인증 서비스 호출로 바꾸면 됩니다. */
  const demoAuth = {
    getAccount() {
      const session = this.getSession();
      return this.getAccounts().find((account) => account.nickname === session) || null;
    },
    getAccounts() {
      try {
        const saved = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "null");
        if (Array.isArray(saved)) return saved;
        const legacy = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || "null");
        return legacy ? [legacy] : [];
      } catch (_) { return []; }
    },
    signUp(nickname, password) {
      const accounts = this.getAccounts();
      if (accounts.some((account) => account.nickname.toLowerCase() === nickname.toLowerCase())) return { ok: false, message: text[language].accountExists };
      try {
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, { nickname, password, joinedAt: new Date().toISOString() }]));
        localStorage.setItem(SESSION_KEY, nickname);
        localStorage.setItem(PROFILE_KEY, nickname);
        return { ok: true };
      } catch (_) { return { ok: false, message: text[language].storageError }; }
    },
    login(nickname, password) {
      const accounts = this.getAccounts();
      if (!accounts.length) return { ok: false, message: text[language].accountMissing };
      const account = accounts.find((item) => item.nickname.toLowerCase() === nickname.toLowerCase() && item.password === password);
      if (!account) {
        return { ok: false, message: text[language].loginFailed };
      }
      try {
        localStorage.setItem(SESSION_KEY, account.nickname);
        localStorage.setItem(PROFILE_KEY, account.nickname);
        return { ok: true, nickname: account.nickname };
      } catch (_) { return { ok: false, message: text[language].storageError }; }
    },
    getSession() {
      try { return localStorage.getItem(SESSION_KEY) || ""; }
      catch (_) { return ""; }
    },
    logout() {
      try { localStorage.removeItem(SESSION_KEY); } catch (_) { /* 다음 방문 때 로그인 화면을 보여줍니다. */ }
    }
  };

  /* 로그인 성공 뒤 앱을 표시하고, 지도 크기를 다시 계산합니다. */
  function showApp(nickname, showLoginWelcome = false) {
    currentUserId = nickname;
    const savedProfile = getProfile(nickname);
    currentNickname = savedProfile?.nickname || nickname;
    $("#welcome-screen").hidden = true;
    $("#app-shell").hidden = false;
    document.body.classList.remove("welcome-mode");
    document.body.classList.add("app-mode");
    setText("#signed-in-name", nickname);
    applyLanguage();
    if (!map) initializeMap();
    else requestAnimationFrame(() => map.invalidateSize());
    if (pendingSignupProfile || !savedProfile) { openProfileSetup(); return; }
    $("#profile-setup-screen").hidden = true;
    $("#profile-page").hidden = true;
    renderNotifications();
    updateDiaryToggleState();
    if (showLoginWelcome) showWelcomeMap();
    else {
      $("#welcome-map-screen").hidden = true;
      $(".map-screen").hidden = false;
    }
    if (pendingSharedPostId && !showLoginWelcome) openPendingSharedPost();
  }

  function openPendingSharedPost() {
    if (!pendingSharedPostId) return;
    const post = posts.find((item) => String(item.id) === pendingSharedPostId);
    pendingSharedPostId = null;
    if (post) requestAnimationFrame(() => {
      switchRegion(post.region);
      if (Number.isFinite(post.lat) && Number.isFinite(post.lng)) map.setView([post.lat, post.lng], 16);
      focusPost(post);
      const marker = markers.find((item) => {
        const point = item.getLatLng();
        return point.lat === post.lat && point.lng === post.lng;
      });
      marker?.openPopup();
    });
    else window.setTimeout(() => alert("해당 게시글을 찾을 수 없어요. 같은 브라우저에 저장된 게시글인지 확인해주세요."), 0);
  }

  // 환영 지도에서 한국과 일본, 현재까지 작성된 모든 게시글을 함께 보여줍니다.
  function showWelcomeMap() {
    if (!composePanel.hidden) closeCompose();
    $("#profile-setup-screen").hidden = true;
    $("#profile-page").hidden = true;
    $(".map-screen").hidden = true;
    $("#welcome-map-screen").hidden = false;
    $("#profile-open-button").hidden = true;
    renderWelcomeMapSummary();
    if (!welcomeMap) initializeWelcomeMap();
    else {
      renderWelcomeMarkers();
      requestAnimationFrame(() => welcomeMap.invalidateSize());
    }
  }

  function renderWelcomeMapSummary() {
    const w = text[language];
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayCount = posts.filter((post) => {
      const createdAt = Date.parse(post.createdAt || "");
      return Number.isFinite(createdAt) && createdAt >= startOfToday.getTime();
    }).length;
    setText("#welcome-map-greeting", w.welcomeGreeting(currentNickname || currentUserId));
    setText("#welcome-map-summary", `${w.welcomeTotal} ${posts.length} · ${w.welcomeToday} ${todayCount}`);
    setText("#welcome-map-start", w.welcomeStart);
    $("#welcome-map")?.setAttribute("aria-label", w.welcomeMapLabel);
    $("#home-logo")?.setAttribute("aria-label", w.homeLogo);
  }

  function initializeWelcomeMap() {
    const element = $("#welcome-map");
    if (!element || !window.L || typeof L.markerClusterGroup !== "function") {
      if (element) element.textContent = language === "ko"
        ? "환영 지도를 불러오지 못했습니다. 지도 연결을 확인해주세요."
        : "ウェルカムマップを読み込めませんでした。接続を確認してください。";
      return;
    }
    welcomeMap = L.map(element, { zoomControl: true, scrollWheelZoom: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(welcomeMap);
    welcomePostLayer = L.markerClusterGroup();
    welcomeMap.addLayer(welcomePostLayer);
    renderWelcomeMarkers();
    requestAnimationFrame(() => {
      welcomeMap.invalidateSize();
      fitWelcomeMap();
    });
  }

  function fitWelcomeMap() {
    if (!welcomeMap) return;
    const points = posts.filter((post) => Number.isFinite(post.lat) && Number.isFinite(post.lng) && !isPostHidden(post) && !isBlockedContent(post))
      .map((post) => [post.lat, post.lng]);
    const bounds = L.latLngBounds([[33, 124], [46, 146]]);
    points.forEach((point) => bounds.extend(point));
    welcomeMap.fitBounds(bounds, { padding: [36, 36], maxZoom: 6 });
  }

  function renderWelcomeMarkers() {
    if (!welcomeMap || !welcomePostLayer) return;
    welcomePostLayer.clearLayers();
    posts.filter((post) => Number.isFinite(post.lat) && Number.isFinite(post.lng) && !isPostHidden(post) && !isBlockedContent(post))
      .forEach((post) => {
        const marker = L.marker([post.lat, post.lng]);
        const popup = `<strong>${escapeHtml(post.place || post.title || "")}</strong><br>${escapeHtml(post.nickname)}<br><time>${escapeHtml(formatPostDate(post.createdAt))}</time>`;
        marker.bindPopup(popup, { className: "welcome-post-popup" });
        welcomePostLayer.addLayer(marker);
      });
    fitWelcomeMap();
  }

  /* 로그아웃하면 시작 화면으로 돌아가며 계정은 이 브라우저에 남습니다. */
  function showWelcome() {
    if (!composePanel.hidden) closeCompose();
    $("#app-shell").hidden = true;
    $("#welcome-screen").hidden = false;
    document.body.classList.remove("app-mode");
    document.body.classList.remove("diary-open");
    document.body.classList.remove("compose-open");
    document.body.classList.add("welcome-mode");
    currentNickname = "";
    currentUserId = "";
    $("#notifications-panel").hidden = true;
    $("#notifications-button").setAttribute("aria-expanded", "false");
    $("#diary-panel").hidden = true;
    $("#diary-toggle").setAttribute("aria-expanded", "false");
    viewingProfileId = "";
    profileHistory = [];
    profileOrigin = { kind: "map" };
    $("#profile-setup-screen").hidden = true;
    $("#profile-page").hidden = true;
    $("#auth-form")?.reset();
    registrationMode = false;
    $("#signup-consents").hidden = true; $("#signup-password-confirm-wrap").hidden = true;
    $("#auth-password-confirm").disabled = true; $("#auth-password-confirm").required = false;
    $("#signup-button").disabled = false;
    ["#signup-id-hint", "#signup-password-hint", "#signup-password-confirm-hint"].forEach((selector) => { $(selector).hidden = true; });
    $("#auth-status").textContent = "";
    applyLanguage();
  }

  /* 프로필과 좋아요의 저장 처리를 모아 Firebase 교체 지점으로 둡니다. */
  function getProfiles() { try { return JSON.parse(localStorage.getItem(PROFILES_KEY) || "{}"); } catch (_) { return {}; } }
  function saveProfiles(value) { try { localStorage.setItem(PROFILES_KEY, JSON.stringify(value)); return true; } catch (_) { return false; } }
  function getProfile(userId) { return getProfiles()[userId] || null; }
  function getLikedPostIds() { try { return (JSON.parse(localStorage.getItem(LIKES_KEY) || "{}")[currentUserId] || []); } catch (_) { return []; } }
  function saveLikedPostIds(ids) { try { const value = JSON.parse(localStorage.getItem(LIKES_KEY) || "{}"); value[currentUserId] = ids; localStorage.setItem(LIKES_KEY, JSON.stringify(value)); } catch (_) { /* 저장 실패 시 현재 화면은 계속 사용할 수 있습니다. */ } }
  // 팔로우 관계는 localStorage 접근을 아래 함수에 한정해 Firebase로 바꿀 수 있게 합니다.
  function getFollowData() {
    try {
      const saved = JSON.parse(localStorage.getItem(FOLLOWS_KEY) || "{}");
      return { following: saved && typeof saved.following === "object" && saved.following !== null ? saved.following : {} };
    } catch (error) {
      console.warn("팔로우 정보를 읽지 못했습니다.", error);
      return { following: {} };
    }
  }
  function saveFollowData(value) {
    try { localStorage.setItem(FOLLOWS_KEY, JSON.stringify(value)); return true; }
    catch (error) { console.error("팔로우 정보를 저장하지 못했습니다.", error); return false; }
  }
  function getFollowingIds(userId) {
    const following = getFollowData().following;
    return Array.isArray(following[userId]) ? following[userId] : [];
  }
  function getFollowerIds(userId) {
    const following = getFollowData().following;
    return Object.keys(following).filter((followerId) => Array.isArray(following[followerId]) && following[followerId].includes(userId));
  }
  // 한국과 일본의 공통 현지 날짜는 UTC+9 기준으로 계산합니다.
  function getDiaryDate(timestamp = Date.now()) {
    return new Date(timestamp + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  }
  // 공개 피드와 하루 한 편의 팔로워 전용 일기는 서로 다른 작성 규칙을 사용합니다.
  function updateDiaryToggleState() {
    const now = Date.now();
    const today = getDiaryDate(now);
    const done = getDiaries().some((diary) => diary.userId === currentUserId && diary.dateKey === today);
    const locale = language === "ja" ? "ja-JP" : "ko-KR";
    const date = new Date(`${today}T12:00:00+09:00`);
    $("#diary-panel-today").textContent = new Intl.DateTimeFormat(locale, {
      year: "numeric", month: "long", day: "numeric", weekday: "long", timeZone: "Asia/Tokyo"
    }).format(date);
    setText("#diary-panel-prompt", text[language].diaryIntro);
    setText(".diary-toggle-label-desktop", text[language].diaryToggle);
    setText(".diary-toggle-label-mobile", text[language].diaryToggleMobile);
    const status = $("#diary-toggle-status");
    status.textContent = done ? text[language].diaryDone : "";
    status.hidden = !done;
    $("#diary-unwritten-dot").hidden = done;
    $("#diary-toggle").classList.toggle("has-unwritten-diary", !done);
    $("#diary-toggle").setAttribute("aria-label", done ? `${text[language].diaryToggle} · ${text[language].diaryDone}` : text[language].diaryToggle);
  }
  function getDiaries() {
    try {
      const saved = JSON.parse(localStorage.getItem(DIARIES_KEY) || "[]");
      return Array.isArray(saved) ? saved
        .filter((diary) => diary && diary.id && diary.userId && /^\d{4}-\d{2}-\d{2}$/.test(diary.dateKey))
        .map((diary) => ({
          ...diary,
          location: isValidDiaryLocation(diary.location) &&
            Number.isFinite(Number(diary.location.lat)) && Math.abs(Number(diary.location.lat)) <= 90 &&
            Number.isFinite(Number(diary.location.lng)) && Math.abs(Number(diary.location.lng)) <= 180
            ? { name: diary.location.name.slice(0, 150), lat: Number(diary.location.lat), lng: Number(diary.location.lng) }
            : null,
          heartBy: Array.isArray(diary.heartBy) ? diary.heartBy : [],
          comments: Array.isArray(diary.comments) ? diary.comments.filter((comment) => comment && typeof comment.text === "string") : []
        })) : [];
    } catch (error) {
      console.warn("일기를 읽지 못했습니다.", error);
      return [];
    }
  }
  function saveDiaries(diaries) {
    try {
      localStorage.setItem(DIARIES_KEY, JSON.stringify(diaries));
      return true;
    } catch (error) {
      console.error("일기를 저장하지 못했습니다.", error);
      alert(text[language].saveError);
      return false;
    }
  }
  function isValidDiaryLocation(location) {
    return Boolean(location && typeof location.name === "string" && location.name.trim() &&
      location.lat !== null && location.lat !== "" && Number.isFinite(Number(location.lat)) &&
      location.lng !== null && location.lng !== "" && Number.isFinite(Number(location.lng)));
  }
  function visibleDiaryForViewer(diary, viewerId = currentUserId) {
    return !diary.deleted && !getBlockedIds(viewerId).includes(diary.userId) && (diary.userId === viewerId || getFollowingIds(viewerId).includes(diary.userId));
  }
  function setDiaryLocation(location) {
    const valid = isValidDiaryLocation(location) &&
      Math.abs(Number(location.lat)) <= 90 && Math.abs(Number(location.lng)) <= 180;
    diaryLocationDraft = valid
      ? { name: location.name.trim().slice(0, 150) || text[language].diaryLocationSelected, lat: Number(location.lat), lng: Number(location.lng) }
      : null;
    const preview = $("#diary-location-preview");
    preview.hidden = !diaryLocationDraft;
    $("#diary-location-name").value = diaryLocationDraft?.name || "";
    if (diaryLocationPickerMarker) {
      diaryLocationPickerMarker.remove();
      diaryLocationPickerMarker = null;
    }
    if (diaryLocationDraft && diaryLocationPickerMap) {
      const point = [diaryLocationDraft.lat, diaryLocationDraft.lng];
      diaryLocationPickerMarker = L.marker(point).addTo(diaryLocationPickerMap);
      diaryLocationPickerMarker.bindPopup(escapeHtml(diaryLocationDraft.name));
      diaryLocationPickerMap.setView(point, Math.max(14, diaryLocationPickerMap.getZoom()));
    }
  }
  function initializeDiaryLocationPicker() {
    const element = $("#diary-location-picker-map");
    if (!element || diaryLocationPickerMap || !window.L) return;
    diaryLocationPickerMap = L.map(element, { zoomControl: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(diaryLocationPickerMap);
    diaryLocationPickerMap.setView(locales[currentRegion].center, 12);
    diaryLocationPickerMap.on("click", (event) => {
      setDiaryLocation({
        name: text[language].diaryLocationAt(event.latlng.lat, event.latlng.lng),
        lat: event.latlng.lat,
        lng: event.latlng.lng
      });
    });
    requestAnimationFrame(() => {
      diaryLocationPickerMap.invalidateSize();
      if (diaryLocationDraft) setDiaryLocation(diaryLocationDraft);
    });
  }
  async function searchDiaryLocation() {
    const query = $("#diary-location-query").value.trim();
    const status = $("#diary-location-status");
    const resultsTarget = $("#diary-location-results");
    resultsTarget.replaceChildren();
    if (!query) {
      status.textContent = text[language].diaryLocationEmpty;
      return;
    }
    if (diaryLocationSearchRequest) diaryLocationSearchRequest.abort();
    const request = new AbortController();
    diaryLocationSearchRequest = request;
    status.textContent = text[language].diaryLocationLoading;
    try {
      const wait = Math.max(0, 1100 - (Date.now() - lastSearchTime));
      if (wait) await new Promise((resolve) => setTimeout(resolve, wait));
      if (request.signal.aborted) return;
      lastSearchTime = Date.now();
      const params = new URLSearchParams({
        format: "jsonv2",
        q: query,
        limit: "5",
        addressdetails: "1",
        "accept-language": language
      });
      const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
        headers: { Accept: "application/json" },
        signal: request.signal
      });
      if (!response.ok) throw new Error(`Nominatim returned ${response.status}`);
      const results = await response.json();
      if (diaryLocationSearchRequest !== request) return;
      if (!Array.isArray(results) || !results.length) {
        status.textContent = text[language].diaryLocationEmpty;
        return;
      }
      status.textContent = "";
      results.forEach((result) => {
        const lat = Number(result.lat);
        const lng = Number(result.lon);
        if (!Number.isFinite(lat) || Math.abs(lat) > 90 || !Number.isFinite(lng) || Math.abs(lng) > 180) return;
        const name = String(result.name || result.display_name || query).slice(0, 150);
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = String(result.display_name || name);
        button.addEventListener("click", () => {
          setDiaryLocation({ name, lat, lng });
          resultsTarget.replaceChildren();
          status.textContent = "";
        });
        resultsTarget.append(button);
      });
      if (!resultsTarget.childElementCount) status.textContent = text[language].diaryLocationEmpty;
    } catch (error) {
      if (error.name === "AbortError") return;
      console.error("일기 장소를 검색하지 못했습니다.", error);
      if (diaryLocationSearchRequest === request) status.textContent = text[language].diaryLocationError;
    } finally {
      if (diaryLocationSearchRequest === request) diaryLocationSearchRequest = null;
    }
  }
  function initializeDiaryMap() {
    const element = $("#diary-map");
    if (!element || diaryMap || !window.L) return;
    diaryMap = L.map(element, { zoomControl: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(diaryMap);
    diaryMapLayer = L.layerGroup().addTo(diaryMap);
    diaryMap.setView([36.5, 134], 4);
  }
  // 일기 위치는 공개 피드 핀과 분리해 작성자와 팔로워에게만 표시합니다.
  function renderDiaryMap(focusDiaryId = "") {
    initializeDiaryMap();
    if (!diaryMap || !diaryMapLayer) return;
    diaryMapLayer.clearLayers();
    diaryMapMarkers = new Map();
    const entries = getDiaries().filter((diary) => visibleDiaryForViewer(diary) && diary.location);
    $("#diary-map-empty").hidden = entries.length > 0;
    $("#diary-map-empty").textContent = text[language].diaryMapEmpty;
    entries.forEach((diary) => {
      const location = diary.location;
      const marker = L.marker([location.lat, location.lng], {
        icon: L.divIcon({
          className: "diary-location-marker",
          html: '<span class="diary-location-pin" aria-hidden="true">★</span>',
          iconSize: [34, 40],
          iconAnchor: [17, 34]
        })
      }).addTo(diaryMapLayer);
      const excerpt = [...String(diary.body || "")].slice(0, 110).join("");
      const popup = document.createElement("div");
      popup.className = "diary-map-popup";
      const heading = document.createElement("strong");
      heading.textContent = diaryDateLabel(diary.dateKey);
      const author = document.createElement("div");
      author.textContent = `${getPublicProfile(diary.userId).nickname} · ${diary.mood || "😊"}`;
      const body = document.createElement("div");
      body.className = "diary-map-popup-body";
      body.textContent = excerpt;
      popup.append(heading, author, body);
      marker.bindPopup(popup);
      diaryMapMarkers.set(diary.id, marker);
    });
    requestAnimationFrame(() => {
      diaryMap.invalidateSize();
      if (focusDiaryId && diaryMapMarkers.has(focusDiaryId)) {
        const marker = diaryMapMarkers.get(focusDiaryId);
        diaryMap.setView(marker.getLatLng(), 15);
        marker.openPopup();
      } else if (entries.length === 1) {
        const location = entries[0].location;
        diaryMap.setView([location.lat, location.lng], 12);
      } else if (entries.length > 1) {
        diaryMap.fitBounds(L.latLngBounds(entries.map((diary) => [diary.location.lat, diary.location.lng])), { padding: [24, 24], maxZoom: 11 });
      } else {
        diaryMap.setView([36.5, 134], 4);
      }
    });
  }
  function diaryDateLabel(dateKey) {
    const date = new Date(`${dateKey}T12:00:00+09:00`);
    return new Intl.DateTimeFormat(language === "ja" ? "ja-JP" : "ko-KR", {
      year: "numeric", month: "long", day: "numeric", weekday: "short", timeZone: "Asia/Tokyo"
    }).format(date);
  }
  function getDiaryStreak(userId) {
    const dates = new Set(getDiaries().filter((diary) => diary.userId === userId && !diary.deleted).map((diary) => diary.dateKey));
    let date = getDiaryDate();
    if (!dates.has(date)) date = getDiaryDate(Date.now() - 86400000);
    let streak = 0;
    while (dates.has(date)) {
      streak += 1;
      date = getDiaryDate(Date.parse(`${date}T12:00:00+09:00`) - 86400000);
    }
    return streak;
  }
  function setFollowing(userId, follow) {
    if (!currentUserId || !userId || userId === currentUserId) return false;
    const data = getFollowData();
    const ids = Array.isArray(data.following[currentUserId]) ? data.following[currentUserId] : [];
    data.following[currentUserId] = follow
      ? [...new Set([...ids, userId])]
      : ids.filter((id) => id !== userId);
    if (!data.following[currentUserId].length) delete data.following[currentUserId];
    return saveFollowData(data);
  }
  function removeFollowRelationships(userId) {
    const data = getFollowData();
    delete data.following[userId];
    Object.keys(data.following).forEach((followerId) => {
      data.following[followerId] = (Array.isArray(data.following[followerId]) ? data.following[followerId] : []).filter((id) => id !== userId);
      if (!data.following[followerId].length) delete data.following[followerId];
    });
    return saveFollowData(data);
  }
  // 알림, 신고, 차단, 저장 목록은 현재 사용자별 localStorage 데이터로 관리합니다.
  function readUserMap(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "{}");
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch (error) {
      console.warn(`저장 데이터(${key})를 읽지 못했습니다.`, error);
      return {};
    }
  }
  function getBlockedIds(userId = currentUserId) {
    const blocks = readUserMap(BLOCKS_KEY);
    return Array.isArray(blocks[userId]) ? blocks[userId] : [];
  }
  function getBookmarks(userId = currentUserId) {
    const bookmarks = readUserMap(BOOKMARKS_KEY);
    return Array.isArray(bookmarks[userId]) ? bookmarks[userId] : [];
  }
  function saveBookmarks(ids) {
    const bookmarks = readUserMap(BOOKMARKS_KEY);
    bookmarks[currentUserId] = [...new Set(ids)];
    try { localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks)); return true; }
    catch (error) { console.error("저장한 글을 저장하지 못했습니다.", error); alert(text[language].storageError); return false; }
  }
  function getReports() {
    try {
      const reports = JSON.parse(localStorage.getItem(REPORTS_KEY) || "[]");
      return Array.isArray(reports) ? reports.filter((report) => report && report.reporterId && report.targetType) : [];
    } catch (error) { console.warn("신고 정보를 읽지 못했습니다.", error); return []; }
  }
  function isPostHidden(post) {
    return Boolean(post.hiddenByReports) || getReports().filter((report) => report.targetType === "post" && report.targetId === String(post.id)).length >= 3;
  }
  function isBlockedContent(post) {
    return getBlockedIds().includes(userIdForPost(post));
  }
  function getNotifications() {
    try {
      const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || "[]");
      return Array.isArray(notifications) ? notifications.filter((item) => item && item.id && item.recipientId) : [];
    } catch (error) { console.warn("알림을 읽지 못했습니다.", error); return []; }
  }
  function saveNotifications(items) {
    try { localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(items)); return true; }
    catch (error) { console.error("알림을 저장하지 못했습니다.", error); return false; }
  }
  function addNotification(recipientId, type, actorId, postId = "") {
    if (!recipientId || !actorId || recipientId === actorId || getBlockedIds(recipientId).includes(actorId)) return;
    const notifications = getNotifications();
    notifications.unshift({
      id: `notice-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      recipientId, actorId, type, postId: String(postId || ""), createdAt: new Date().toISOString(), read: false
    });
    if (saveNotifications(notifications)) renderNotifications();
  }
  function renderNotifications() {
    const w = text[language], items = getNotifications().filter((item) => item.recipientId === currentUserId);
    const unread = items.filter((item) => !item.read).length;
    const badge = $("#notification-count");
    badge.textContent = String(unread);
    badge.hidden = !unread;
    setText("#notifications-title", w.notificationTitle);
    $("#notifications-panel")?.setAttribute("aria-label", w.notificationTitle);
    setText("#notifications-read-all", w.readAll);
    const list = $("#notifications-list");
    if (!list) return;
    list.replaceChildren();
    if (!items.length) {
      const empty = document.createElement("p"); empty.className = "notification-empty"; empty.textContent = w.noNotifications; list.append(empty); return;
    }
    items.slice(0, 50).forEach((item) => {
      const button = document.createElement("button");
      button.type = "button"; button.className = `notification-item${item.read ? "" : " is-unread"}`; button.dataset.notificationId = item.id;
      button.dataset.notificationActor = item.actorId; button.dataset.notificationPost = item.postId;
      const actor = getPublicProfile(item.actorId).nickname;
      const message = item.type === "like" ? w.notificationLike(actor) : item.type === "comment" ? w.notificationComment(actor) : item.type === "follow" ? w.notificationFollow(actor) : w.notificationDiary(actor);
      const label = document.createElement("span"); label.textContent = message;
      const date = document.createElement("time"); date.dateTime = item.createdAt; date.textContent = formatPostDate(item.createdAt);
      button.append(label, date); list.append(button);
    });
  }
  function setUserBlocked(userId, block) {
    if (!userId || userId === currentUserId) return;
    const blocks = readUserMap(BLOCKS_KEY);
    const current = Array.isArray(blocks[currentUserId]) ? blocks[currentUserId] : [];
    blocks[currentUserId] = block ? [...new Set([...current, userId])] : current.filter((id) => id !== userId);
    if (!blocks[currentUserId].length) delete blocks[currentUserId];
    try { localStorage.setItem(BLOCKS_KEY, JSON.stringify(blocks)); }
    catch (error) { console.error("차단 설정을 저장하지 못했습니다.", error); alert(text[language].storageError); return; }
    if (block) {
      const previous = getFollowData();
      previous.following[currentUserId] = getFollowingIds(currentUserId).filter((id) => id !== userId);
      previous.following[userId] = getFollowingIds(userId).filter((id) => id !== currentUserId);
      if (!previous.following[currentUserId].length) delete previous.following[currentUserId];
      if (!previous.following[userId].length) delete previous.following[userId];
      if (!saveFollowData(previous)) {
        blocks[currentUserId] = current;
        if (!blocks[currentUserId].length) delete blocks[currentUserId];
        try { localStorage.setItem(BLOCKS_KEY, JSON.stringify(blocks)); } catch (error) { console.error("차단 설정을 복구하지 못했습니다.", error); }
        alert(text[language].storageError);
        return;
      }
    }
    renderBlockedUsers();
    renderFeed(); renderMarkers();
    if (!$("#diary-panel").hidden) renderDiaries();
    if (welcomeMap && !$("#welcome-map-screen").hidden) renderWelcomeMarkers();
    if (viewingProfileId) { renderProfileStats(viewingProfileId); renderProfileDiary(viewingProfileId); }
    if (!$("#post-detail-modal").hidden && activeDetailPostId) {
      const post = posts.find((entry) => String(entry.id) === activeDetailPostId);
      if (!post || isBlockedContent(post)) $("#post-detail-modal").hidden = true;
      else renderPostDetail(post);
    }
  }
  function renderBlockedUsers() {
    const target = $("#blocked-users-list"); if (!target) return;
    target.replaceChildren();
    const ids = getBlockedIds();
    if (!ids.length) { const empty = document.createElement("p"); empty.textContent = text[language].noBlocked; target.append(empty); return; }
    ids.forEach((id) => {
      const row = document.createElement("div"); row.className = "blocked-user-row";
      const name = document.createElement("span"); name.textContent = getPublicProfile(id).nickname;
      const button = document.createElement("button"); button.type = "button"; button.dataset.unblockUser = id; button.textContent = text[language].unblock;
      row.append(name, button); target.append(row);
    });
  }
  function openReport(type, id, postId = "", commentIndex = -1) {
    reportTarget = { type, id: String(id || ""), postId: String(postId || ""), commentIndex };
    $("#report-form").reset();
    $("#report-status").textContent = "";
    delete $("#report-status").dataset.state;
    $("#report-modal").hidden = false;
    setText("#report-title", text[language].reportTitle);
  }
  // 번역 요청은 사용자가 동의한 뒤에만 외부 API로 전송합니다.
  function translateText(source, button, output) {
    if (!source.trim()) {
      output.textContent = text[language].translationFailed;
      output.hidden = false;
      return;
    }
    if (button.dataset.translated === "true") {
      output.hidden = true;
      button.dataset.translated = "false";
      button.textContent = text[language].translate;
      return;
    }
    if (button.dataset.translation) {
      output.textContent = button.dataset.translation;
      output.hidden = false;
      button.dataset.translated = "true";
      button.textContent = text[language].original;
      return;
    }
    if (!translationConsentGranted) {
      if (!confirm(text[language].translationConsent)) return;
      translationConsentGranted = true;
    }
    const korean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(source);
    const japanese = /[ぁ-ゟ゠-ヿ]/.test(source);
    const sourceLanguage = korean ? "ko" : japanese ? "ja" : button.dataset.sourceLanguage || (language === "ko" ? "ja" : "ko");
    const pair = `${sourceLanguage}|${sourceLanguage === "ko" ? "ja" : "ko"}`;
    button.disabled = true;
    button.textContent = text[language].translating;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(source)}&langpair=${pair}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Translation API returned ${response.status}`);
        return response.json();
      })
      .then((result) => {
        const translated = result?.responseData?.translatedText;
        if (!translated || result.responseStatus !== 200) throw new Error("Translation API did not return a translation.");
        button.dataset.translation = translated;
        button.dataset.translated = "true";
        delete output.dataset.translationError;
        output.textContent = translated;
        output.hidden = false;
        button.textContent = text[language].original;
      })
      .catch((error) => {
        console.warn("번역 요청에 실패했습니다.", error);
        output.textContent = text[language].translationFailed;
        output.dataset.translationError = "true";
        output.hidden = false;
        button.textContent = text[language].translate;
      })
      .finally(() => { window.clearTimeout(timeout); button.disabled = false; });
  }
  function addCommentExtras(item, post, comment, index) {
    const tools = document.createElement("div"); tools.className = "comment-tools";
    const translate = document.createElement("button");
    translate.type = "button"; translate.dataset.translateTarget = `comment-${post.id}-${index}`; translate.textContent = text[language].translate;
    const commentProfile = getPublicProfile(comment.userId || userIdForNickname(comment.nickname));
    translate.dataset.sourceLanguage = commentProfile.residence === "tokyo" ? "ja" : "ko";
    translate.disabled = !comment.text?.trim();
    const report = document.createElement("button");
    report.type = "button"; report.dataset.reportType = "comment"; report.dataset.reportPostId = post.id; report.dataset.reportCommentIndex = String(index); report.textContent = text[language].report;
    tools.append(translate, report); item.append(tools);
    const translation = document.createElement("p");
    translation.className = "translation-result"; translation.dataset.translationOutput = `comment-${post.id}-${index}`; translation.hidden = true;
    item.append(translation);
  }
  // 가입 직후에만 자동으로 보여주고, 프로필 도움말에서 다시 열 수 있습니다.
  function showTutorial() {
    tutorialIndex = 0;
    $("#tutorial-skip-checkbox").checked = false;
    renderTutorial();
    $("#tutorial-modal").hidden = false;
  }
  function renderTutorial() {
    const w = text[language], slide = w.tutorialSlides[tutorialIndex];
    setText("#tutorial-step", `${tutorialIndex + 1} / ${w.tutorialSlides.length}`);
    setText("#tutorial-title", slide.title);
    setText("#tutorial-description", slide.description);
    setText("#tutorial-skip-label", w.tutorialSkip);
    setText("#tutorial-prev", w.tutorialPrev);
    setText("#tutorial-next", tutorialIndex === w.tutorialSlides.length - 1 ? w.tutorialDone : w.tutorialNext);
    $("#tutorial-prev").disabled = tutorialIndex === 0;
  }
  function closeTutorial() {
    const seen = readUserMap(TUTORIAL_KEY);
    seen[currentUserId] = true;
    try { localStorage.setItem(TUTORIAL_KEY, JSON.stringify(seen)); }
    catch (error) { console.error("튜토리얼 설정을 저장하지 못했습니다.", error); }
    $("#tutorial-modal").hidden = true;
  }
  function userIdForNickname(nickname) {
    const normalized = String(nickname || "").toLocaleLowerCase();
    const profileEntry = Object.entries(getProfiles()).find(([, profile]) => profile.nickname?.toLocaleLowerCase() === normalized);
    if (profileEntry) return profileEntry[0];
    const account = demoAuth.getAccounts().find((entry) => entry.nickname.toLocaleLowerCase() === normalized);
    return account?.nickname || `legacy:${nickname}`;
  }
  function userIdForPost(post) { return post.authorId || userIdForNickname(post.nickname); }
  function avatarSource(profile) {
    if (profile?.photo) return profile.photo;
    const initial = (profile?.nickname || currentNickname || "?").trim().charAt(0) || "?";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><circle cx="64" cy="64" r="64" fill="#87CEEB"/><text x="64" y="82" text-anchor="middle" font-size="58" font-family="sans-serif" font-weight="700" fill="#244956">${escapeHtml(initial)}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }
  function setAvatar(image, profile = getProfile(currentUserId)) { if (image) image.src = avatarSource(profile); }
  function openProfileSetup() {
    $(".map-screen").hidden = true; $("#welcome-map-screen").hidden = true; $("#profile-page").hidden = true; $("#profile-setup-screen").hidden = false;
    $("#profile-open-button").hidden = true;
    const profile = getProfile(currentUserId); $("#setup-nickname").value = profile?.nickname || "";
    $("#setup-residence").value = profile?.residence || "jeonju";
    profilePhotoDraft = profile?.photo || ""; setAvatar($("#setup-avatar"), { nickname: $("#setup-nickname").value, photo: profilePhotoDraft }); $("#setup-status").textContent = "";
  }
  function openProfilePage() {
    profileHistory = [];
    profileOrigin = { kind: "map" };
    showProfile(currentUserId);
  }
  function getUserPosts(userId) {
    return posts.filter((post) => userIdForPost(post) === userId)
      .sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0));
  }
  function getPublicProfile(userId) {
    const profile = getProfile(userId);
    const account = demoAuth.getAccounts().find((entry) => entry.nickname === userId);
    const userPosts = getUserPosts(userId);
    const latest = userPosts[0];
    return {
      nickname: profile?.nickname || account?.nickname || latest?.nickname || userId.replace(/^legacy:/, ""),
      photo: profile?.photo || latest?.authorPhoto || "",
      residence: profile?.residence || latest?.region || "jeonju",
      joinedAt: profile?.joinedAt || account?.joinedAt || userPosts.map((post) => post.createdAt).filter(Boolean).sort()[0] || ""
    };
  }
  function formatJoinedAt(value) {
    const timestamp = Date.parse(value || "");
    if (!Number.isFinite(timestamp)) return text[language].noJoinedDate;
    return new Intl.DateTimeFormat(language === "ja" ? "ja-JP" : "ko-KR", { year: "numeric", month: "long", day: "numeric" }).format(timestamp);
  }
  // 게시글 작성 시각을 오늘·어제·경과 일수 또는 현지 날짜로 표시합니다.
  function formatPostDate(value) {
    const timestamp = Date.parse(value || "");
    if (!Number.isFinite(timestamp)) return text[language].noJoinedDate;
    const date = new Date(timestamp);
    const locale = language === "ja" ? "ja-JP" : "ko-KR";
    const dayStart = (value) => {
      const local = new Date(value);
      return Date.UTC(local.getFullYear(), local.getMonth(), local.getDate());
    };
    const daysAgo = Math.round((dayStart(Date.now()) - dayStart(date)) / 86400000);
    let relative;
    if (daysAgo === 0) relative = language === "ja" ? "今日" : "오늘";
    else if (daysAgo === 1) relative = language === "ja" ? "昨日" : "어제";
    else if (daysAgo > 1 && daysAgo < 7) relative = language === "ja" ? `${daysAgo}日前` : `${daysAgo}일 전`;
    if (relative) {
      const time = new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", hour12: true }).format(date);
      return `${relative} ${time}`;
    }
    const parts = new Intl.DateTimeFormat(locale, {
      year: "numeric", month: "2-digit", day: "2-digit", weekday: "short"
    }).formatToParts(date).reduce((result, part) => {
      result[part.type] = part.value;
      return result;
    }, {});
    const time = new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", hour12: true }).format(date);
    return `${parts.year}.${parts.month}.${parts.day} (${parts.weekday}) ${time}`;
  }
  function showProfile(userId) {
    if (!userId) return;
    viewingProfileId = userId;
    const own = userId === currentUserId;
    $(".map-screen").hidden = true;
    $("#profile-setup-screen").hidden = true;
    $("#profile-page").hidden = false;
    setText("#back-to-map", own && !profileHistory.length ? text[language].backMap : text[language].profileBack);
    $("#profile-open-button").hidden = !own;
    $("#edit-profile-button").hidden = !own;
    $("#edit-profile-form").hidden = true;
    $("#profile-logout-button").hidden = !own;
    $("#delete-account-button").hidden = !own;
    $("#profile-tabs").hidden = !own;
    $("#profile-diary-section").hidden = own;
    $("#policies-button").hidden = !own;
    $("#profile-safety-actions").hidden = own;
    $(".blocked-users-settings").hidden = !own;
    const profile = getPublicProfile(userId);
    setText("#profile-name", profile.nickname);
    setAvatar($("#profile-avatar"), profile);
    $("#profile-joined").textContent = `${text[language].joinedAt}: ${formatJoinedAt(profile.joinedAt)}`;
    $("#profile-residence").textContent = `${text[language].residenceLabel}: ${locales[profile.residence]?.name[language] || locales.jeonju.name[language]}`;
    if (own) {
      $("#edit-nickname").value = profile.nickname;
      $("#edit-residence").value = profile.residence;
      profilePhotoDraft = profile.photo || "";
      setAvatar($("#edit-avatar-preview"), profile);
      renderBlockedUsers();
      activeProfileTab = "posts";
    }
    renderProfileStats(userId);
    renderProfileTab();
    renderProfileDiary(userId);
    requestAnimationFrame(() => map?.invalidateSize());
  }
  function openUserProfile(userId, origin = null) {
    if (!userId) return;
    if (!viewingProfileId && userId === currentUserId) {
      profileOrigin = origin || { kind: $("#post-detail-modal").hidden ? "map" : "detail", postId: activeDetailPostId };
      profileHistory = [];
      $("#post-detail-modal").hidden = true;
      showProfile(userId);
      return;
    }
    if (viewingProfileId) profileHistory.push({
      userId: viewingProfileId,
      detailPostId: $("#post-detail-modal").hidden ? "" : activeDetailPostId
    });
    else profileOrigin = origin || { kind: $("#post-detail-modal").hidden ? "map" : "detail", postId: activeDetailPostId };
    $("#follow-list-modal").hidden = true;
    $("#post-detail-modal").hidden = true;
    detailBackToProfile = false;
    showProfile(userId);
  }
  function returnFromProfile() {
    if (profileHistory.length) {
      const previous = profileHistory.pop();
      showProfile(previous.userId);
      if (previous.detailPostId) {
        const post = posts.find((item) => String(item.id) === previous.detailPostId);
        if (post) {
          renderPostDetail(post);
          $("#post-detail-back").hidden = previous.userId === currentUserId;
          $("#post-detail-modal").hidden = false;
        }
      }
      return;
    }
    const origin = profileOrigin;
    viewingProfileId = "";
    $("#profile-page").hidden = true;
    $(".map-screen").hidden = false;
    $("#profile-open-button").hidden = false;
    if (origin.kind === "detail") {
      const post = posts.find((item) => String(item.id) === origin.postId);
      if (post) {
        renderPostDetail(post);
        $("#post-detail-modal").hidden = false;
      }
    }
    profileOrigin = { kind: "map" };
    requestAnimationFrame(() => map?.invalidateSize());
  }
  function renderProfileStats(userId) {
    setText("#profile-post-count", `${text[language].postsCount} ${getUserPosts(userId).filter((post) => !isPostHidden(post) && !isBlockedContent(post)).length} ·`);
    $('[data-follow-list="followers"]').textContent = `${text[language].followers} ${getFollowerIds(userId).length} ·`;
    $('[data-follow-list="following"]').textContent = `${text[language].following} ${getFollowingIds(userId).length}`;
    const button = $("#profile-follow-button");
    button.hidden = userId === currentUserId;
    if (!button.hidden) {
      const blocked = getBlockedIds().includes(userId);
      button.disabled = blocked;
      button.textContent = blocked ? text[language].blockedEmpty : getFollowingIds(currentUserId).includes(userId) ? text[language].followed : text[language].follow;
      button.dataset.followUser = userId;
      $("#profile-block-button").textContent = getBlockedIds().includes(userId) ? text[language].unblock : text[language].block;
      $("#profile-block-button").dataset.blockUser = userId;
      $("#profile-report-button").dataset.reportUserId = userId;
    }
  }
  function renderFollowList(kind) {
    const userId = viewingProfileId;
    const ids = kind === "followers" ? getFollowerIds(userId) : getFollowingIds(userId);
    const target = $("#follow-list-content");
    target.replaceChildren();
    setText("#follow-list-title", kind === "followers" ? text[language].followers : text[language].following);
    if (!ids.length) {
      const empty = document.createElement("p");
      empty.textContent = kind === "following" && userId === currentUserId ? text[language].noFollowing : text[language].noFollowList;
      target.append(empty);
    }
    ids.forEach((id) => {
      const profile = getPublicProfile(id);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "follow-list-item";
      button.dataset.profileId = id;
      const avatar = document.createElement("img");
      avatar.src = profile.photo ? profile.photo : avatarSource(profile);
      avatar.alt = "";
      const name = document.createElement("span");
      name.textContent = profile.nickname;
      button.append(avatar, name);
      target.append(button);
    });
    $("#follow-list-modal").hidden = false;
  }
  function toggleFollow(userId) {
    if (!userId || userId === currentUserId) return;
    if (getBlockedIds().includes(userId)) return;
    const isFollowing = getFollowingIds(currentUserId).includes(userId);
    if (isFollowing && !confirm(text[language].unfollowConfirm)) return;
    if (!setFollowing(userId, !isFollowing)) {
      alert(text[language].storageError);
      return;
    }
    if (!isFollowing) addNotification(userId, "follow", currentUserId);
    if (viewingProfileId) renderProfileStats(viewingProfileId);
    if (!$("#post-detail-modal").hidden && activeDetailPostId) {
      const post = posts.find((item) => String(item.id) === activeDetailPostId);
      if (post) renderPostDetail(post);
    }
    renderDiaries();
    if (viewingProfileId) renderProfileDiary(viewingProfileId);
    renderFeed();
    if ($("#diary-panel") && !$("#diary-panel").hidden) renderDiaries();
  }
  function nicknameAvailable(name) { return !Object.entries(getProfiles()).some(([id, profile]) => id !== currentUserId && profile.nickname.toLocaleLowerCase() === name.toLocaleLowerCase()); }
  function saveProfile(name, photo, residence) {
    const value = name.trim();
    if (!value) return { ok: false, message: text[language].nicknameRequired };
    if ([...value].length < 2 || [...value].length > 12) return { ok: false, message: text[language].nicknameLength };
    if (!nicknameAvailable(value)) return { ok: false, message: text[language].nicknameTaken };
    const profiles = getProfiles(), previous = profiles[currentUserId];
    const account = demoAuth.getAccounts().find((entry) => entry.nickname === currentUserId);
    profiles[currentUserId] = {
      nickname: value,
      photo: photo || previous?.photo || "",
      residence: locales[residence] ? residence : previous?.residence || "jeonju",
      joinedAt: previous?.joinedAt || account?.joinedAt || new Date().toISOString()
    };
    if (!saveProfiles(profiles)) return { ok: false, message: text[language].saveError };
    const oldName = previous?.nickname || currentUserId;
    if (oldName !== value) {
      posts.forEach((post) => {
        if (post.authorId === currentUserId || (!post.isExample && !post.authorId && post.nickname === oldName)) { post.nickname = value; post.authorId = currentUserId; post.authorPhoto = photo || previous?.photo || ""; }
        (post.comments || []).forEach((comment) => { if (comment.userId === currentUserId || (!post.isExample && !comment.userId && comment.nickname === oldName)) { comment.nickname = value; comment.userId = currentUserId; } });
      });
      savePosts();
    }
    currentNickname = value; try { localStorage.setItem(PROFILE_KEY, value); } catch (_) { /* 프로필 저장소를 주 저장 경로로 사용합니다. */ }
    return { ok: true };
  }
  function renderProfileTab() {
    const target = $("#profile-content"); if (!target) return;
    $$("[data-profile-tab]").forEach((button) => button.setAttribute("aria-selected", String(button.dataset.profileTab === activeProfileTab)));
    target.replaceChildren();
    const owner = viewingProfileId === currentUserId;
    const ownPosts = getUserPosts(viewingProfileId || currentUserId).filter((post) => !isBlockedContent(post) && !isPostHidden(post));
    let entries = [];
    if (!owner || activeProfileTab === "posts") entries = ownPosts.map((post) => ({ type: "post", post }));
    if (owner && activeProfileTab === "comments") entries = posts.filter((post) => !isBlockedContent(post) && !isPostHidden(post)).flatMap((post) => (post.comments || []).map((comment, commentIndex) => ({ type: "comment", post, comment, commentIndex })).filter((entry) => isOwnComment(entry.post, entry.comment) && !getBlockedIds().includes(entry.comment.userId || userIdForNickname(entry.comment.nickname))));
    if (owner && activeProfileTab === "likes") entries = posts.filter((post) => getLikedPostIds().includes(post.id) && !isBlockedContent(post) && !isPostHidden(post)).map((post) => ({ type: "like", post }));
    if (owner && activeProfileTab === "saved") entries = posts.filter((post) => getBookmarks().includes(String(post.id)) && !isBlockedContent(post) && !isPostHidden(post)).map((post) => ({ type: "saved", post }));
    if (owner && activeProfileTab === "diary") {
      renderOwnDiaryHistory(target);
      return;
    }
    if (!entries.length) {
      const empty = document.createElement("p");
      empty.textContent = activeProfileTab === "saved" ? text[language].savedEmpty : activeProfileTab === "comments" ? text[language].noComments : text[language].noPosts;
      target.append(empty); return;
    }
    entries.forEach((entry) => {
      const card = document.createElement("article"); card.className = "profile-item"; card.dataset.profilePostId = entry.post.id; card.tabIndex = 0;
      const title = document.createElement("h3"); title.textContent = entry.type === "comment" ? `${text[language].commentOn}: ${entry.post.place}` : entry.post.place; card.append(title);
      const body = document.createElement("p"); body.textContent = entry.type === "comment" ? entry.comment.text : entry.post.story; card.append(body);
      if (entry.type === "comment" && entry.comment.photo) { const image = document.createElement("img"); image.className = "comment-photo-thumb profile-comment-photo"; image.src = entry.comment.photo; image.alt = text[language].commentPhotoAlt; image.dataset.commentPhoto = "true"; card.append(image); }
      if (entry.type === "comment") appendCommentActions(card, entry.commentIndex, entry.comment);
      if (entry.type !== "comment") {
        const report = document.createElement("button"); report.type = "button"; report.dataset.reportType = "post"; report.dataset.reportPostId = entry.post.id; report.textContent = text[language].report; card.append(report);
      }
      if (owner && entry.type === "post") {
        const edit = document.createElement("button"); edit.type = "button"; edit.textContent = text[language].editPost; edit.dataset.profileEdit = entry.post.id; card.append(edit);
        const del = document.createElement("button"); del.type = "button"; del.textContent = text[language].delete; del.dataset.profileDelete = entry.post.id; card.append(del);
      }
      target.append(card);
    });
  }

  function makeDiaryCard(diary, { interactive = false, ownerControls = false, canEdit = false } = {}) {
    const w = text[language];
    const card = document.createElement("article");
    card.className = "diary-card";
    card.dataset.diaryId = diary.id;
    const heading = document.createElement("div");
    heading.className = "diary-card-heading";
    const mood = document.createElement("span");
    mood.className = "diary-mood";
    mood.textContent = diary.mood || "😊";
    const title = document.createElement("h3");
    title.textContent = diary.title || diaryDateLabel(diary.dateKey);
    heading.append(mood, title);
    if (diary.userId !== currentUserId && getFollowingIds(diary.userId).includes(currentUserId)) {
      const mutual = document.createElement("span");
      mutual.className = "diary-mutual-badge";
      mutual.textContent = w.diaryMutual;
      heading.append(mutual);
    }
    const meta = document.createElement("p");
    meta.className = "diary-card-meta";
    const author = getPublicProfile(diary.userId).nickname;
    meta.textContent = `${author} · ${diaryDateLabel(diary.dateKey)}`;
    const body = document.createElement("p");
    body.className = "diary-card-body";
    body.textContent = diary.body || "";
    card.append(heading, meta, body);
    if (diary.location) {
      const location = document.createElement("button");
      location.type = "button";
      location.className = "diary-location-link";
      location.dataset.diaryAction = "location";
      location.setAttribute("aria-label", w.diaryLocationLink(diary.location.name));
      location.textContent = w.diaryLocationLink(diary.location.name);
      card.append(location);
    }
    if (diary.photo) {
      const image = document.createElement("img");
      image.className = "diary-card-photo";
      image.src = diary.photo;
      image.alt = w.diaryImageAlt;
      image.loading = "lazy";
      card.append(image);
    }
    if (interactive) {
      const actions = document.createElement("div");
      actions.className = "diary-card-actions";
      const heart = document.createElement("button");
      heart.type = "button";
      heart.dataset.diaryAction = "heart";
      const reacted = (diary.heartBy || []).includes(currentUserId);
      heart.textContent = `💙 ${w.diaryHeart} (${(diary.heartBy || []).length})${reacted ? " ✓" : ""}`;
      actions.append(heart);
      card.append(actions);
      const comments = document.createElement("ul");
      comments.className = "diary-comments";
      (diary.comments || []).forEach((comment) => {
        if (getBlockedIds().includes(comment.userId || userIdForNickname(comment.nickname))) return;
        const item = document.createElement("li");
        item.textContent = `${comment.nickname}: ${comment.text}`;
        comments.append(item);
      });
      card.append(comments);
      const form = document.createElement("form");
      form.className = "diary-comment-form";
      form.dataset.diaryComment = diary.id;
      const input = document.createElement("input");
      input.maxLength = 100;
      input.placeholder = w.diaryCommentPlaceholder;
      input.setAttribute("aria-label", w.diaryCommentPlaceholder);
      input.required = true;
      const submit = document.createElement("button");
      submit.type = "submit";
      submit.textContent = w.diaryCommentSubmit;
      form.append(input, submit);
      card.append(form);
    }
    if (ownerControls || canEdit) {
      const actions = document.createElement("div");
      actions.className = "diary-card-actions";
      if (canEdit) {
        const edit = document.createElement("button");
        edit.type = "button";
        edit.dataset.diaryAction = "edit";
        edit.textContent = w.diaryEdit;
        actions.append(edit);
      }
      if (ownerControls) {
        const remove = document.createElement("button");
        remove.type = "button";
        remove.dataset.diaryAction = "delete";
        remove.textContent = w.diaryDelete;
        actions.append(remove);
      }
      card.append(actions);
    }
    return card;
  }

  function renderDiaries() {
    const target = $("#diary-content");
    if (!target) return;
    const mapTab = activeDiaryTab === "map";
    const followingTab = activeDiaryTab === "following";
    $("#diary-compose-section").hidden = followingTab || mapTab;
    $("#diary-privacy-note").hidden = followingTab;
    $("#diary-map-section").hidden = !mapTab;
    target.hidden = mapTab;
    $$("[data-diary-tab]").forEach((button) => button.setAttribute("aria-selected", String(button.dataset.diaryTab === activeDiaryTab)));
    if (mapTab) {
      renderDiaryMap();
      return;
    }
    target.replaceChildren();
    if (!followingTab) {
      const mine = getDiaries().filter((diary) => diary.userId === currentUserId && visibleDiaryForViewer(diary))
        .sort((a, b) => b.dateKey.localeCompare(a.dateKey));
      if (!mine.length) {
        const empty = document.createElement("p");
        empty.className = "diary-empty";
        empty.textContent = text[language].diaryNoToday;
        target.append(empty);
      } else mine.forEach((diary) => target.append(makeDiaryCard(diary, { ownerControls: true, canEdit: diary.dateKey === getDiaryDate() })));
      syncDiaryForm();
      initializeDiaryLocationPicker();
      return;
    }
    const entries = getDiaries().filter((diary) => diary.userId !== currentUserId && visibleDiaryForViewer(diary))
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey) || (Date.parse(b.updatedAt || b.createdAt) || 0) - (Date.parse(a.updatedAt || a.createdAt) || 0));
    if (!entries.length) {
      const empty = document.createElement("p");
      empty.className = "diary-empty";
      empty.textContent = text[language].diaryFollowingEmpty;
      target.append(empty);
      return;
    }
    entries.forEach((diary) => target.append(makeDiaryCard(diary, { interactive: true })));
  }

  function syncDiaryForm() {
    const today = getDiaryDate();
    const diaries = getDiaries();
    const todayDiary = diaries.find((diary) => diary.userId === currentUserId && diary.dateKey === today);
    const editing = todayDiary && !todayDiary.deleted && editingDiaryId === todayDiary.id;
    const blocked = Boolean(todayDiary && (!editing || todayDiary.deleted));
    updateDiaryToggleState();
    const form = $("#diary-form");
    if (!form) return;
    $("#diary-daily-status").textContent = blocked ? text[language].diaryTodayExists : "";
    [...form.elements].forEach((element) => { element.disabled = blocked && element.id !== "diary-cancel-edit"; });
    $("#diary-title").disabled = blocked;
    $("#diary-body").disabled = blocked;
    $("#diary-photo").disabled = blocked;
    $$('input[name="diary-mood"]').forEach((input) => { input.disabled = blocked; });
    $("#diary-submit").disabled = blocked;
    $("#diary-submit").textContent = editing ? text[language].diaryUpdate : text[language].diaryWrite;
    $("#diary-cancel-edit").hidden = !editing;
    $("#diary-cancel-edit").textContent = text[language].diaryCancel;
    if (!editing) {
      const resetDraft = blocked || !diaryFormInitialized || diaryFormDateKey !== today;
      if (resetDraft) {
        form.reset();
        diaryPhotoDraft = "";
        $("#diary-photo-preview").hidden = true;
        $("#diary-char-count").textContent = "0 / 500";
        setDiaryLocation(null);
        $("#diary-location-results").replaceChildren();
        $("#diary-location-status").textContent = "";
      }
      diaryFormInitialized = true;
      diaryFormDateKey = today;
    } else {
      const diary = todayDiary;
      $("#diary-title").value = diary.title || "";
      $("#diary-body").value = diary.body || "";
      const mood = $(`input[name="diary-mood"][value="${diary.mood || "😊"}"]`);
      if (mood) mood.checked = true;
      diaryPhotoDraft = diary.photo || "";
      setDiaryPhotoPreview(diaryPhotoDraft);
      $("#diary-char-count").textContent = `${[...diary.body].length} / 500`;
      setDiaryLocation(diary.location || null);
      diaryFormInitialized = true;
      diaryFormDateKey = today;
    }
  }

  function setDiaryPhotoPreview(photo) {
    const preview = $("#diary-photo-preview");
    preview.hidden = !photo;
    if (photo) {
      const image = $("img", preview);
      image.src = photo;
      image.alt = text[language].diaryImageAlt;
    } else $("img", preview).removeAttribute("src");
  }

  function renderProfileDiary(userId) {
    const target = $("#profile-diary-content");
    const section = $("#profile-diary-section");
    if (!target || !section) return;
    const own = userId === currentUserId;
    section.hidden = own;
    if (own) return;
    const following = getFollowingIds(currentUserId).includes(userId);
    setText("#profile-diary-heading", `${getPublicProfile(userId).nickname} · ${text[language].diary}`);
    target.replaceChildren();
    if (!following || getBlockedIds().includes(userId)) {
      const locked = document.createElement("p");
      locked.className = "diary-locked";
      locked.textContent = text[language].diaryFollowRequired;
      target.append(locked);
      return;
    }
    const entries = getDiaries().filter((diary) => diary.userId === userId && !diary.deleted)
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey));
    if (!entries.length) {
      const empty = document.createElement("p");
      empty.className = "diary-empty";
      empty.textContent = text[language].diaryEmpty;
      target.append(empty);
      return;
    }
    entries.forEach((diary) => {
      if (getFollowingIds(currentUserId).includes(userId)) target.append(makeDiaryCard(diary));
    });
  }

  function renderOwnDiaryHistory(target) {
    const w = text[language];
    const entries = getDiaries().filter((diary) => diary.userId === currentUserId && !diary.deleted)
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey));
    const controls = document.createElement("div");
    controls.className = "diary-history-controls";
    const streak = document.createElement("strong");
    streak.textContent = w.diaryStreak(getDiaryStreak(currentUserId));
    const mode = document.createElement("button");
    mode.type = "button";
    mode.dataset.diaryView = diaryViewMode === "list" ? "calendar" : "list";
    mode.textContent = diaryViewMode === "list" ? w.diaryCalendar : w.diaryList;
    controls.append(streak, mode);
    target.append(controls);
    if (diaryViewMode === "calendar") {
      const calendar = document.createElement("div");
      calendar.className = "diary-calendar";
      const heading = document.createElement("div");
      heading.className = "diary-calendar-heading";
      const previous = document.createElement("button");
      previous.type = "button"; previous.dataset.diaryMonth = "-1"; previous.textContent = "‹";
      const month = document.createElement("strong");
      month.textContent = new Intl.DateTimeFormat(language === "ja" ? "ja-JP" : "ko-KR", { year: "numeric", month: "long", timeZone: "Asia/Tokyo" }).format(new Date(`${diaryMonth}-15T12:00:00+09:00`));
      const next = document.createElement("button");
      next.type = "button"; next.dataset.diaryMonth = "1"; next.textContent = "›";
      heading.append(previous, month, next);
      calendar.append(heading);
      const grid = document.createElement("div");
      grid.className = "diary-calendar-grid";
      const offset = new Date(`${diaryMonth}-01T12:00:00+09:00`).getUTCDay();
      for (let blank = 0; blank < offset; blank += 1) grid.append(document.createElement("span"));
      const days = new Date(Date.UTC(Number(diaryMonth.slice(0, 4)), Number(diaryMonth.slice(5, 7)), 0)).getUTCDate();
      const dates = new Set(entries.map((diary) => diary.dateKey));
      for (let day = 1; day <= days; day += 1) {
        const dateKey = `${diaryMonth}-${String(day).padStart(2, "0")}`;
        const button = document.createElement("button");
        button.type = "button"; button.textContent = String(day);
        if (dates.has(dateKey)) { button.classList.add("has-diary"); button.dataset.diaryDate = dateKey; }
        grid.append(button);
      }
      calendar.append(grid);
      target.append(calendar);
    }
    const list = document.createElement("div");
    list.className = "diary-history-list";
    entries.forEach((diary) => {
      if (diaryViewMode === "calendar" && !diary.dateKey.startsWith(diaryMonth)) return;
      const card = makeDiaryCard(diary, { ownerControls: true, canEdit: diary.dateKey === getDiaryDate() });
      list.append(card);
    });
    if (!list.childElementCount) {
      const empty = document.createElement("p");
      empty.className = "diary-empty"; empty.textContent = w.diaryEmpty; list.append(empty);
    }
    target.append(list);
  }

  // 예전 댓글의 userId가 없는 경우에는 비예시 글의 닉네임으로 작성자를 확인합니다.
  function isOwnComment(post, comment) {
    return Boolean(currentUserId) && (
      comment.userId === currentUserId ||
      (!post.isExample && !comment.userId && comment.nickname === currentNickname)
    );
  }

  // 내가 쓴 댓글에만 댓글 전체 삭제와 사진만 삭제 동작을 표시합니다.
  function appendCommentActions(container, index, comment) {
    const actions = document.createElement("div");
    actions.className = "comment-actions";
    const remove = document.createElement("button");
    remove.type = "button";
    remove.dataset.commentAction = "delete";
    remove.dataset.commentIndex = String(index);
    remove.textContent = `🗑 ${text[language].deleteComment}`;
    remove.setAttribute("aria-label", text[language].deleteComment);
    actions.append(remove);
    if (comment.photo) {
      const removePhoto = document.createElement("button");
      removePhoto.type = "button";
      removePhoto.dataset.commentAction = "photo";
      removePhoto.dataset.commentIndex = String(index);
      removePhoto.textContent = text[language].deleteCommentPhoto;
      actions.append(removePhoto);
    }
    container.append(actions);
  }

  // 댓글 변경은 저장에 성공한 경우에만 화면에 반영하고, 실패하면 원래 값을 복원합니다.
  function updateComment(postId, index, action) {
    const post = posts.find((item) => String(item.id) === String(postId));
    const comments = post?.comments || [];
    const comment = comments[index];
    if (!post || !comment || !isOwnComment(post, comment)) return;
    if (action === "delete") {
      if (!confirm(text[language].deleteCommentConfirm)) return;
      const [removed] = comments.splice(index, 1);
      if (!savePosts(text[language].commentSaveError)) { comments.splice(index, 0, removed); return; }
    } else {
      if (!comment.photo || !confirm(text[language].deleteCommentPhotoConfirm)) return;
      const photo = comment.photo;
      comment.photo = "";
      if (!savePosts(text[language].commentSaveError)) { comment.photo = photo; return; }
    }
    renderFeed();
    if (!$("#post-detail-modal").hidden && activeDetailPostId === String(post.id)) renderPostDetail(post);
    if (!$("#profile-page").hidden) renderProfileTab();
  }

  function loadPosts() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(saved)) {
        let migrated = false;
        const loaded = saved.filter((post) => post && (
          locales[post.region] || (Number.isFinite(post.lat) && Number.isFinite(post.lng))
        )).map((post) => {
          if (Number.isFinite(Date.parse(post.createdAt || ""))) return post;
          migrated = true;
          return { ...post, createdAt: new Date().toISOString() };
        });
        if (migrated) {
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded)); }
          catch (error) { console.warn("게시글 작성 시간을 저장하지 못했습니다.", error); }
        }
        return loaded;
      }
    } catch (error) { console.warn("저장된 게시글을 읽지 못했습니다.", error); }
    return examples.map((post) => ({ ...post, comments: post.comments || [], reactions: post.reactions || [], photo: "", isExample: true }));
  }

  /* 게시글과 반응을 브라우저에 저장해 새로고침 뒤에도 유지합니다. */
  function savePosts(errorMessage = text[language].saveError) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); }
    catch (error) { alert(errorMessage); console.warn("게시글을 저장하지 못했습니다.", error); return false; }
    renderWelcomeMapSummary();
    renderWelcomeMarkers();
    return true;
  }

  function setText(selector, value) {
    const element = $(selector);
    if (element) element.textContent = value;
  }

  /* 버튼, 검색 안내, 입력 폼 문구를 한국어 또는 일본어로 바꿉니다. */
  function applyLanguage() {
    const w = text[language];
    document.documentElement.lang = language;
    setText(".brand-caption", w.tagline);
    setText("#language-heading", w.languageHeading);
    setText("#auth-heading", w.loginHeading);
    setText("#login-button", w.login);
    setText("#signup-button", w.signup);
    setText("#demo-note", w.demoNote);
    setText("#profile-open-button", w.profile);
    setText("#profile-setup-heading", w.setup);
    setText("#start-button", w.start);
    setText("#edit-profile-button", w.edit);
    setText("#back-to-map", viewingProfileId && (viewingProfileId !== currentUserId || profileHistory.length) ? w.profileBack : w.backMap);
    setText("#save-profile-button", w.save);
    setText("#profile-logout-button", w.logout);
    setText("#policies-button", w.policies); setText("#delete-account-button", w.withdraw);
    setText("#terms-consent-label", w.consentTerms); setText("#privacy-consent-label", w.consentPrivacy); setText("#age-consent-label", w.consentAge); setText("#consent-all-label", w.consentAll);
    setText("#signup-consents-legend", language === "ko" ? "가입 동의" : "登録への同意");
    $$('.modal-close').forEach((button) => button.setAttribute("aria-label", language === "ko" ? "닫기" : "閉じる"));
    $$('[data-policy]').forEach((button) => { if (!button.id.includes("withdraw-")) button.textContent = w.viewFull; });
    setText("#posting-warning-text", w.postingWarning);
    setText("#withdraw-title", w.withdrawTitle); setText("#withdraw-warning", w.withdrawWarning); setText("#withdraw-items", w.withdrawItems); setText("#withdraw-confirm-label", w.withdrawCheck); setText("#withdraw-password-label", w.withdrawPassword); setText("#withdraw-cancel", w.cancel); setText("#withdraw-submit", w.withdrawSubmit); setText("#withdraw-privacy-link", w.policyPrivacy); setText("#withdraw-terms-link", w.policyTerms);
    $("#profile-avatar")?.setAttribute("alt", w.profilePhotoAlt);
    $("#setup-avatar")?.setAttribute("alt", w.photoPreviewAlt);
    $("#edit-avatar-preview")?.setAttribute("alt", w.photoPreviewAlt);
    $("#profile-page [role=tablist]")?.setAttribute("aria-label", w.profileTabsLabel);
    setText('[for="setup-nickname"]', w.nickname);
    setText('[for="edit-nickname"]', w.nickname);
    setText('[for="setup-residence"]', w.residenceLabel);
    setText('[for="edit-residence"]', w.residenceLabel);
    setText('[for="setup-photo"]', w.profilePhoto);
    setText('[for="edit-photo"]', w.profilePhoto);
    ["#setup-residence", "#edit-residence"].forEach((selector) => {
      const select = $(selector);
      if (select) [...select.options].forEach((option) => { option.textContent = locales[option.value].name[language]; });
    });
    const tabLabels = { posts: w.myPosts, comments: w.myComments, likes: w.likesTab, diary: w.diaryMine, saved: w.savedTab };
    $$('[data-profile-tab]').forEach((button) => { button.textContent = tabLabels[button.dataset.profileTab]; });
    setText("#diary-panel-title", `📔 ${w.diary}`);
    $("#diary-panel")?.setAttribute("aria-label", w.diary);
    $("#diary-panel [role=tablist]")?.setAttribute("aria-label", w.diary);
    $("#diary-toggle")?.setAttribute("aria-expanded", String(!$("#diary-panel").hidden));
    updateDiaryToggleState();
    $("#diary-close")?.setAttribute("aria-label", w.close);
    $$("[data-diary-tab]").forEach((button) => {
      button.textContent = button.dataset.diaryTab === "following" ? w.diaryFollowing
        : button.dataset.diaryTab === "map" ? w.diaryMap : w.diaryMine;
      button.setAttribute("aria-selected", String(button.dataset.diaryTab === activeDiaryTab));
    });
    setText("#diary-privacy-note", w.diaryPrivacy);
    setText("#diary-title-label", w.diaryTitle);
    setText("#diary-mood-label", w.diaryMood);
    setText("#diary-body-label", w.diaryBody);
    setText("#diary-photo-label", w.diaryPhoto);
    setText("#diary-location-label", w.diaryLocation);
    $("#diary-location-query")?.setAttribute("placeholder", w.diaryLocationSearchPlaceholder);
    $("#diary-location-query")?.setAttribute("aria-label", w.diaryLocationSearch);
    $("#diary-location-name")?.setAttribute("aria-label", w.diaryLocationSelected);
    setText("#diary-location-search-button", w.diaryLocationSearchButton);
    setText("#diary-location-remove", w.diaryLocationRemove);
    $("#diary-location-picker-map")?.setAttribute("aria-label", w.diaryLocationMapLabel);
    $("#diary-map-section")?.setAttribute("aria-label", w.diaryMap);
    $("#diary-map")?.setAttribute("aria-label", w.diaryMap);
    setText("#diary-map-privacy-note", w.diaryMapPrivacy);
    setText("#diary-photo-remove", "×");
    $("#diary-photo-remove")?.setAttribute("aria-label", w.diaryPhotoRemove);
    setText("#profile-diary-heading", `${getPublicProfile(viewingProfileId || currentUserId).nickname} · ${w.diary}`);
    setText('label[for="auth-nickname"]', registrationMode ? (language === "ko" ? "아이디" : "ID") : w.nickname);
    setText('label[for="auth-password"]', w.password);
    setText("#auth-password-confirm-label", w.passwordConfirm);
    setText("#post-detail-close", "×"); $("#post-detail-close")?.setAttribute("aria-label", w.detailClose);
    setText("#post-detail-back", w.profileBack);
    setText("#post-detail-comments-title", w.detailComments);
    setText("#post-detail-comment-label", w.commentInput); $("#post-detail-comment-input")?.setAttribute("placeholder", w.commentInput);
    setText("#post-detail-comment-submit", w.commentSubmit);
    setText("#post-detail-comment-status", "");
    $("#comment-photo-attach")?.setAttribute("aria-label", w.attachPhoto);
    $("#comment-photo-remove")?.setAttribute("aria-label", w.removePhoto);
    $("#comment-photo-preview")?.setAttribute("alt", w.commentPhotoPreview);
    $("#comment-photo-viewer")?.setAttribute("aria-label", w.commentPhotoAlt);
    $("#comment-photo-viewer-image")?.setAttribute("alt", w.commentPhotoAlt);
    $("#auth-nickname")?.setAttribute("placeholder", w.loginNamePlaceholder);
    $("#auth-password")?.setAttribute("placeholder", w.passwordPlaceholder);
    $$('[data-language]').forEach((button) => {
      const selected = button.dataset.language === language;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    $("header nav")?.setAttribute("aria-label", w.languageHeading);
    mapElement.setAttribute("aria-label", w.mapLabel);
    setText("#feed-heading", w.feed);
    renderWelcomeMapSummary();
    $("#feed-region-filters")?.setAttribute("aria-label", w.feedRegionLabel);
    $$("[data-feed-region]").forEach((button) => {
      const labels = { all: w.feedAll, jeonju: w.feedJeonju, tokyo: w.feedTokyo };
      button.textContent = labels[button.dataset.feedRegion];
      button.setAttribute("aria-pressed", String(button.dataset.feedRegion === feedRegionFilter));
    });
    $(".feed-sort-options")?.setAttribute("aria-label", w.feedSortLabel);
    $$("[data-feed-sort]").forEach((button) => {
      button.textContent = button.dataset.feedSort === "popular" ? w.sortPopular : w.sortNewest;
      button.setAttribute("aria-pressed", String(button.dataset.feedSort === feedSort));
    });
    setText("#feed-load-more", w.loadMore);
    setText("#write-heading", w.write);
    setText("#mypage-button", showMine ? w.all : w.mine);
    setText("#close-compose", "×");
    $("#close-compose")?.setAttribute("aria-label", w.close);
    $("#compose-button")?.setAttribute("aria-label", w.compose);
    $("#search-input")?.setAttribute("placeholder", w.searchPlaceholder);
    $("#search-input")?.setAttribute("aria-label", w.searchLabel);
    $("#place-search button")?.setAttribute("aria-label", w.searchButton);
    $("#category-filters")?.setAttribute("aria-label", w.categoryFilterLabel);
    $("#map-category-filters")?.setAttribute("aria-label", w.categoryMapFilterLabel);
    $("#category-legend")?.setAttribute("aria-label", w.categoryLegendLabel);
    $("#search-results")?.setAttribute("aria-label", w.searchResultLabel);
    setText("#search-reset", w.searchReset);
    renderCategoryControls();
    renderSearchResults(lastSearchResults);
    if (welcomeMap && !$("#welcome-map-screen").hidden) renderWelcomeMarkers();
    if ($("#search-input").value.trim()) {
      $("#search-status").textContent = lastSearchResults.length ? "" : w.noResults;
      $("#search-reset").hidden = lastSearchResults.length > 0;
    }
    const labels = { nickname: w.nickname, "post-region": w.residence, place: w.place, category: w.category, photo: w.photo, story: w.story };
    Object.entries(labels).forEach(([id, value]) => { const label = $(`label[for="${id}"]`); if (label) label.textContent = value; });
    setText("#post-form button[type=submit]", postEditId ? w.save : w.submit);
    if ($("#profile-page") && !$("#profile-page").hidden) {
      renderProfileTab();
      renderProfileDiary(viewingProfileId);
    }
    const regionSelect = $("#post-region");
    if (regionSelect) {
      regionSelect.options[0].textContent = w.choose;
      regionSelect.options[1].textContent = locales.jeonju.name[language];
      regionSelect.options[2].textContent = locales.tokyo.name[language];
    }
    const categorySelect = $("#category");
    if (categorySelect) {
      categorySelect.options[0].textContent = w.choose;
      [...categorySelect.options].slice(1).forEach((option) => { option.textContent = categories[language][option.value]; });
    }
    if (!$("#post-detail-modal").hidden && activeDetailPostId) renderPostDetail(posts.find((item) => String(item.id) === activeDetailPostId));
    $$('header nav button').forEach((button) => button.setAttribute("aria-pressed", String(button.lang === language)));
    $$('[data-region]').forEach((button) => {
      button.textContent = locales[button.dataset.region].name[language];
      button.setAttribute("aria-pressed", String(button.dataset.region === currentRegion));
    });
    updateSignupValidation();
    setText("#notifications-title", w.notificationTitle);
    setText("#notifications-read-all", w.readAll);
    setText("#blocked-users-heading", w.blocked);
    setText("#tutorial-help-button", w.tutorialHelp);
    setText("#report-reason-abuse", w.reasonAbuse);
    setText("#report-reason-illegal", w.reasonIllegal);
    setText("#report-reason-privacy", w.reasonPrivacy);
    setText("#report-reason-advertising", w.reasonAdvertising);
    setText("#report-reason-other", w.reasonOther);
    setText("#report-submit", w.reportSubmit);
    setText("#report-title", w.reportTitle);
    const reportStatus = $("#report-status");
    if (reportStatus.dataset.state === "done") reportStatus.textContent = w.reportDone;
    if (reportStatus.dataset.state === "duplicate") reportStatus.textContent = w.reportDuplicate;
    if (reportStatus.dataset.state === "storage") reportStatus.textContent = w.storageError;
    $$(".translation-result[data-translation-error='true']").forEach((output) => { output.textContent = w.translationFailed; });
    $$('[data-report-type]').forEach((button) => { if (button.id !== "post-detail-report") button.textContent = w.report; });
    $$('[data-translate-target]').forEach((button) => { if (button.dataset.translated !== "true" && button.disabled === false) button.textContent = w.translate; });
    setText("#post-title-count", w.charsRemaining(Math.max(0, 50 - [...$("#place").value].length)));
    setText("#post-story-count", w.charsRemaining(Math.max(0, 1000 - [...$("#story").value].length)));
    if (currentUserId) { renderNotifications(); renderBlockedUsers(); }
    if (!$("#tutorial-modal").hidden) renderTutorial();
    renderFeed();
    if (currentUserId && !$("#diary-panel").hidden && activeDiaryTab === "map") renderDiaryMap();
    if (viewingProfileId) {
      const profile = getPublicProfile(viewingProfileId);
      $("#profile-joined").textContent = `${w.joinedAt}: ${formatJoinedAt(profile.joinedAt)}`;
      $("#profile-residence").textContent = `${w.residenceLabel}: ${locales[profile.residence]?.name[language] || locales.jeonju.name[language]}`;
      renderProfileStats(viewingProfileId);
      if (!$("#follow-list-modal").hidden) renderFollowList($("#follow-list-title").textContent === w.followers ? "followers" : "following");
    }
  }

  // 카테고리 필터와 색상 범례를 현재 언어로 다시 그립니다.
  function renderCategoryControls() {
    const w = text[language];
    $$("[data-category-filter]").forEach((button) => {
      const key = button.dataset.categoryFilter;
      button.textContent = key === "all" ? w.categoryAll : categories[language][key];
      button.setAttribute("aria-pressed", String(key === categoryFilter));
    });
    const legend = $("#category-legend");
    if (!legend) return;
    legend.replaceChildren();
    Object.keys(categoryColors).forEach((key) => {
      const item = document.createElement("span");
      item.className = "category-legend-item";
      const swatch = document.createElement("span");
      swatch.className = "category-legend-swatch";
      swatch.style.backgroundColor = categoryColors[key];
      swatch.setAttribute("aria-hidden", "true");
      const label = document.createElement("span");
      label.textContent = categories[language][key];
      item.append(swatch, label);
      legend.append(item);
    });
  }

  // 게시글 검색 결과는 DOM API로 구성해 사용자 입력이 HTML로 실행되지 않게 합니다.
  function renderSearchResults(results) {
    const list = $("#search-results");
    if (!list) return;
    list.replaceChildren();
    list.hidden = !results.length;
    results.forEach((post) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.searchPostId = String(post.id);
      button.setAttribute("role", "listitem");
      const title = document.createElement("span");
      title.className = "search-result-title";
      title.textContent = post.title || post.place;
      const meta = document.createElement("span");
      meta.className = "search-result-meta";
      meta.textContent = `${locales[post.region]?.name[language] || post.region} · ${categories[language][post.category] || post.category} · ${text[language].searchResultMeta}: ${post.nickname}`;
      button.append(title, meta);
      list.append(button);
    });
  }

  // 회원가입 칸마다 조건을 즉시 검사하고, 모두 맞을 때만 가입 버튼을 활성화합니다.
  function updateSignupValidation() {
    if (!registrationMode) return;
    const w = text[language], id = $("#auth-nickname").value.trim(), password = $("#auth-password").value, confirmation = $("#auth-password-confirm").value;
    const duplicate = demoAuth.getAccounts().some((account) => account.nickname.toLowerCase() === id.toLowerCase());
    const idFormat = /^[a-z][a-z0-9]{3,15}$/.test(id);
    const idOk = idFormat && !duplicate;
    const hasLetter = /[A-Za-z]/.test(password), hasNumber = /[0-9]/.test(password), hasSpace = /\s/.test(password);
    const passwordLength = password.length >= 8 && password.length <= 20;
    const passwordSameId = Boolean(id) && password.toLowerCase() === id.toLowerCase();
    const passwordOk = passwordLength && hasLetter && hasNumber && !hasSpace && !passwordSameId;
    const confirmOk = Boolean(password) && confirmation === password;
    const showHint = (selector, valid, message) => {
      const hint = $(selector); hint.hidden = false; hint.textContent = `${valid ? "✓ " : "• "}${message}`;
      hint.classList.toggle("is-valid", valid); hint.classList.toggle("is-invalid", !valid);
    };
    showHint("#signup-id-hint", idOk, idOk ? w.idValid : (idFormat && duplicate ? w.idDuplicate : w.idRule));
    showHint("#signup-password-hint", passwordOk, passwordOk ? w.passwordValid : (passwordSameId ? w.passwordSameId : w.passwordRule));
    showHint("#signup-password-confirm-hint", confirmOk, confirmOk ? w.passwordMatch : (confirmation ? w.passwordMismatch : w.passwordConfirmHint));
    const consentOk = [...$$('[data-consent]')].every((box) => box.checked);
    $("#signup-button").disabled = !(idOk && passwordOk && confirmOk && consentOk);
  }

  // 약관 초안을 한국어와 일본어로 표시합니다.
  function openPolicy(kind) {
    if (kind === "menu") {
      const target = $("#policy-content"); target.replaceChildren();
      [["terms", text[language].policyTerms], ["privacy", text[language].policyPrivacy], ["content", text[language].policyContent], ["license", text[language].policyLicense]].forEach(([key, label]) => {
        const button = document.createElement("button"); button.type = "button"; button.textContent = label; button.className = "policy-menu-item";
        button.addEventListener("click", () => openPolicy(key)); target.append(button);
      });
      $("#modal-title").textContent = text[language].policies; $("#policy-modal").hidden = false; return;
    }
    const ja = language === "ja";
    const docs = ja ? {
      terms: ["利用規約", "Haru Pinは全州と東京の大学生が日常を共有するフィードサービスです。フォロワー限定の日記は1日1件まで投稿できます。日記の位置情報は本人とそのフォロワーだけに公開されます。", "中傷、違法撮影物、著作権侵害、個人情報の公開、差別表現、迷惑広告は禁止です。", text[language].reportPolicy, "投稿・コメント・ユーザーを暴言、違法な盗撮画像、個人情報の漏えい、広告、その他の理由で報告できます。報告された投稿は確認のため非表示にする場合があります。"],
      privacy: ["個人情報保護方針", "ニックネーム、プロフィール写真、パスワード、投稿・写真・コメント・日記・日記の位置情報・いいねをサービス提供のために扱います。日記の位置情報は本人とそのフォロワーだけに公開され、公開フィード、地図、検索結果には表示されません。", "退会まで保管し、退会時にすぐ削除します。翻訳ボタンを使用すると、選択した投稿やコメントの文章がMyMemory翻訳APIに送信されます。場所検索では検索語がNominatimに送信され、地図タイルの表示要求がOpenStreetMapに送信されます。アプリ内で日記の正確な位置情報をフォロワー以外に公開することはありません。閲覧・修正・削除・退会を求められます。現在はこのブラウザー内だけに保存されます。"],
      content: ["コンテンツの著作権", "投稿した文章と写真の著作権は投稿者にあります。運営のためアプリ内で表示することに同意します。", "他人の写真や顔が写った写真は、同意なく投稿しないでください。"],
      license: ["オープンソース・地図ライセンス", "地図データ © OpenStreetMap contributors（ODbL）。地図表示にはLeaflet、場所検索にはNominatimを使用しています。"]
    } : {
      terms: ["이용약관", "하루핀은 전주와 도쿄 대학생이 일상을 나누는 피드 서비스예요. 팔로워 전용 일기는 하루 1개까지 쓸 수 있어요. 일기의 위치 정보는 작성자 본인과 그 사람의 팔로워에게만 공개돼요.", "타인 비방, 불법 촬영물, 저작권 침해, 개인정보 노출, 혐오 표현과 스팸 광고는 금지해요.", text[language].reportPolicy, "게시글·댓글·사용자를 욕설, 불법 촬영물, 개인정보 노출, 광고, 기타 사유로 신고할 수 있어요. 서비스를 변경하거나 중단할 수 있어요."],
      privacy: ["개인정보 처리방침", "닉네임, 프로필 사진, 비밀번호, 작성한 글·사진·댓글·일기·일기 위치 정보·좋아요를 서비스 제공을 위해 수집해요. 일기 위치 정보는 작성자 본인과 그 사람의 팔로워에게만 공개되고, 공개 피드·지도·검색 결과에는 표시되지 않아요.", "탈퇴할 때까지 보관하고 탈퇴하면 즉시 삭제해요. 번역 버튼을 사용하면 선택한 글과 댓글 내용이 MyMemory 번역 API로 전송돼요. 장소 검색어는 Nominatim으로, 지도 타일 요청은 OpenStreetMap으로 전송돼요. 앱에서 일기의 정확한 위치 정보를 팔로워가 아닌 사용자에게 공개하지 않아요. 열람·수정·삭제를 요청하거나 탈퇴할 수 있어요. 현재 정보는 이 브라우저에만 저장돼요."],
      content: ["콘텐츠 저작권", "올린 글과 사진의 저작권은 작성자에게 있어요. 서비스 운영을 위해 앱 안에서 표시하는 것에 동의해요.", "타인의 사진이나 얼굴이 나온 사진은 동의 없이 올리지 마세요."],
      license: ["오픈소스·지도 라이선스", "지도 데이터 © OpenStreetMap contributors (ODbL). 지도 표시는 Leaflet, 장소 검색은 Nominatim을 사용해요."]
    };
    const lines = [text[language].policyNotice, ...(docs[kind] || docs.terms)];
    $("#modal-title").textContent = lines[1]; const target = $("#policy-content"); target.replaceChildren();
    lines.forEach((line, i) => { const p = document.createElement("p"); p.textContent = line; if (!i) p.className = "policy-notice"; target.append(p); });
    $("#policy-modal").hidden = false;
  }

  /* 핀을 누르면 피드 패널을 펼치고 해당 게시글 카드로 이동합니다. */
  function focusPost(post) {
    if (!post) return;
    showMine = false;
    if (post.region !== currentRegion) switchRegion(post.region);
    feedSheet.classList.remove("is-collapsed");
    $("#feed-toggle")?.setAttribute("aria-expanded", "true");
    renderFeed();
    requestAnimationFrame(() => {
      const card = [...feed.querySelectorAll(".post-card")].find((item) => item.dataset.postId === post.id);
      card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
  }

  // 피드의 지도 버튼은 도시를 바꾸고 해당 장소의 핀을 지도 중심에 둡니다.
  function focusPostOnMap(post) {
    if (!post || !map) return;
    if (post.region !== currentRegion) switchRegion(post.region);
    if (Number.isFinite(post.lat) && Number.isFinite(post.lng)) {
      map.setView([post.lat, post.lng], Math.max(map.getZoom(), 16));
      const marker = markers.find((item) => {
        const point = item.getLatLng();
        return Math.abs(point.lat - post.lat) < 0.000001 && Math.abs(point.lng - post.lng) < 0.000001;
      });
      marker?.openPopup();
    }
  }

  /* 새 게시글을 만들 때 지도에서 고른 위치를 임시 핀으로 표시합니다. */
  function openCompose(location = null, editPost = null) {
    postEditId = editPost ? String(editPost.id) : "";
    setText("#post-form-status", "");
    draftLocation = location;
    if (draftMarker) draftMarker.remove();
    draftMarker = location ? L.marker([location.lat, location.lng]).addTo(map) : null;
    if (draftMarker) draftMarker.bindPopup(text[language].postAt).openPopup();
    composePanel.hidden = false;
    document.body.classList.add("compose-open");
    feedSheet.classList.add("is-collapsed");
    $("#feed-toggle")?.setAttribute("aria-expanded", "false");
    if (location) $("#post-region").value = currentRegion;
    $("#nickname").value = currentNickname;
    if (editPost) {
      $("#post-region").value = editPost.region;
      $("#place").value = editPost.place;
      $("#category").value = editPost.category;
      $("#story").value = editPost.story;
      $("#posting-agreement").checked = true;
      $("#post-submit-button").disabled = false;
    } else {
      form.reset();
      $("#nickname").value = currentNickname;
      $("#posting-agreement").checked = false;
      $("#post-submit-button").disabled = true;
    }
    setText("#write-heading", editPost ? text[language].editPost : text[language].write);
    setText("#post-submit-button", editPost ? text[language].save : text[language].submit);
    updatePostCharCounts();
    $("#nickname")?.focus({ preventScroll: true });
  }

  function closeCompose() {
    composePanel.hidden = true;
    document.body.classList.remove("compose-open");
    draftLocation = null;
    if (draftMarker) draftMarker.remove();
    draftMarker = null;
    postEditId = "";
  }

  // 작성자 링크와 팔로우 버튼을 공유 렌더링 함수로 만들어 카드·상세 화면을 일치시킵니다.
  function makeProfileLink(label, userId, className) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.dataset.profileId = userId;
    button.textContent = label;
    return button;
  }
  function makeInlineFollowButton(userId) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "inline-follow-button";
    button.dataset.followUser = userId;
    button.hidden = !currentUserId || userId === currentUserId;
    button.textContent = getFollowingIds(currentUserId).includes(userId) ? text[language].followed : text[language].follow;
    return button;
  }

  /* 게시글 카드를 DOM API로 만들어 입력된 글이 HTML로 실행되지 않게 합니다. */
  function makeCard(post) {
    const w = text[language];
    const card = document.createElement("article");
    card.className = "post-card";
    card.dataset.postId = post.id;
    if (isPostHidden(post)) {
      card.classList.add("post-hidden-notice");
      const notice = document.createElement("p"); notice.textContent = w.hiddenPost; card.append(notice);
      return card;
    }
    card.tabIndex = 0;
    const userId = userIdForPost(post);
    const author = document.createElement("div");
    author.className = "post-card-author";
    const authorAvatar = document.createElement("img");
    authorAvatar.className = "post-author-avatar";
    authorAvatar.src = getPublicProfile(userId).photo || post.authorPhoto || avatarSource({ nickname: post.nickname });
    authorAvatar.alt = `${post.nickname} ${w.profilePhotoAlt}`;
    const avatarLink = document.createElement("button");
    avatarLink.type = "button";
    avatarLink.className = "profile-link-image";
    avatarLink.dataset.profileId = userId;
    avatarLink.setAttribute("aria-label", post.nickname);
    avatarLink.append(authorAvatar);
    author.append(avatarLink, makeProfileLink(post.nickname, userId, "profile-link-name"), makeInlineFollowButton(userId));
    const title = document.createElement("h3");
    title.textContent = post.place;
    card.append(author, title);
    const badge = document.createElement("span");
    badge.className = "post-city-badge";
    const regionName = locales[post.region]?.name[language] || post.city || post.region;
    const regionFlag = post.region === "tokyo" ? "🇯🇵" : post.region === "jeonju" ? "🇰🇷" : "📍";
    badge.textContent = `${regionFlag} ${regionName}`;
    const detail = document.createElement("p");
    detail.className = "post-card-meta";
    detail.append(badge, document.createTextNode(` · ${categories[language][post.category] || post.category}${post.isExample ? ` · ${w.example}` : ""}`));
    const date = document.createElement("time");
    date.className = "post-card-date";
    date.dateTime = post.createdAt;
    date.textContent = `${formatPostDate(post.createdAt)}${post.editedAt ? ` ${w.edited}` : ""}`;
    card.append(detail, date);
    const story = document.createElement("p");
    story.textContent = post.story;
    card.append(story);
    if (post.photo) {
      const image = document.createElement("img");
      image.src = post.photo;
      image.alt = w.photoAlt;
      image.loading = "lazy";
      card.append(image);
    }
    const actions = document.createElement("div");
    actions.className = "post-actions";
    const mapButton = document.createElement("button");
    mapButton.type = "button"; mapButton.dataset.action = "map";
    mapButton.textContent = `📍 ${w.mapPost}`;
    actions.append(mapButton);
    const like = document.createElement("button");
    like.type = "button"; like.dataset.action = "like";
    like.textContent = `💙 ${w.like} (${post.likes || 0})`;
    actions.append(like);
    const bookmark = document.createElement("button");
    bookmark.type = "button"; bookmark.dataset.action = "bookmark";
    bookmark.textContent = getBookmarks().includes(String(post.id)) ? `🔖 ${w.unsaved}` : `🔖 ${w.saved}`;
    actions.append(bookmark);
    const reaction = document.createElement("button");
    reaction.type = "button"; reaction.dataset.action = "reaction";
    reaction.textContent = `${(post.reactions || []).join(" ") || "😊"} +`;
    reaction.setAttribute("aria-label", w.reaction);
    actions.append(reaction);
    const comment = document.createElement("button");
    comment.type = "button"; comment.dataset.action = "comment";
    comment.textContent = `💬 ${w.comment} (${(post.comments || []).length})`;
    actions.append(comment);
    const share = document.createElement("button");
    share.type = "button"; share.dataset.action = "share";
    share.textContent = `🔗 ${w.shareCount} (${post.shares || 0})`;
    actions.append(share);
    const report = document.createElement("button");
    report.type = "button"; report.dataset.action = "report"; report.dataset.reportType = "post"; report.textContent = w.report;
    actions.append(report);
    if (!post.isExample) {
      if (userId === currentUserId) {
        const edit = document.createElement("button");
        edit.type = "button"; edit.dataset.action = "edit"; edit.textContent = w.editPost;
        actions.append(edit);
      }
      const remove = document.createElement("button");
      remove.type = "button"; remove.dataset.action = "delete"; remove.textContent = w.remove;
      actions.append(remove);
    }
    card.append(actions);
    const visibleComments = (post.comments || []).filter((entry) => !getBlockedIds().includes(entry.userId || userIdForNickname(entry.nickname)));
    if (visibleComments.length) {
      const list = document.createElement("ul"); list.className = "comment-list";
      post.comments.forEach((entry, index) => {
        if (getBlockedIds().includes(entry.userId || userIdForNickname(entry.nickname))) return;
        const item = document.createElement("li");
        item.append(makeProfileLink(entry.nickname, entry.userId || userIdForNickname(entry.nickname), "profile-link-name"), document.createTextNode(`: ${entry.text || ""}`));
        if (entry.photo) { const image = document.createElement("img"); image.className = "comment-photo-thumb"; image.src = entry.photo; image.alt = w.commentPhotoAlt; image.dataset.commentPhoto = "true"; item.append(image); }
        if (isOwnComment(post, entry)) appendCommentActions(item, index, entry);
        const commentReport = document.createElement("button"); commentReport.type = "button"; commentReport.dataset.reportType = "comment"; commentReport.dataset.reportPostId = post.id; commentReport.dataset.reportCommentIndex = String(index); commentReport.textContent = w.report; item.append(commentReport);
        list.append(item);
      });
      card.append(list);
    } else {
      const empty = document.createElement("p"); empty.className = "comment-empty"; empty.textContent = w.noComments; card.append(empty);
    }
    return card;
  }

  /* 게시글 데이터는 현재 localStorage에만 있으므로 공유 링크는 같은 브라우저에서만 열립니다.
     서버가 없는 데모이며, Firebase 도입 시 공유 가능한 게시글 저장소로 교체합니다. */
  async function sharePost(post) {
    const url = new URL(window.location.href);
    url.searchParams.set("post", post.id);
    try {
      await navigator.clipboard.writeText(url.toString());
    } catch (_) {
      const input = document.createElement("textarea");
      input.value = url.toString();
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.append(input);
      input.select();
      const copied = document.execCommand("copy");
      input.remove();
      if (!copied) { alert(language === "ko" ? "링크를 복사하지 못했어요." : "リンクをコピーできませんでした。"); return; }
    }
    // 링크 복사 성공 시 글의 공유 횟수를 저장하고, 카드와 열린 상세 창을 갱신합니다.
    post.shares = (post.shares || 0) + 1;
    savePosts(); renderFeed();
    if (!$("#post-detail-modal").hidden && activeDetailPostId === String(post.id)) renderPostDetail(post);
    alert(language === "ko" ? "링크가 복사되었어요!" : "リンクをコピーしました！");
  }

  /* 선택 지역 또는 마이페이지의 게시글을 하단 패널에 나열합니다. */
  function renderFeed() {
    const visible = posts.filter((post) =>
      (!showMine || post.nickname === currentNickname) &&
      !isBlockedContent(post) &&
      (feedRegionFilter === "all" || post.region === feedRegionFilter) &&
      (categoryFilter === "all" || post.category === categoryFilter) &&
      (activeSearchPostIds === null || activeSearchPostIds.includes(String(post.id)))
    );
    visible.sort((a, b) => {
      if (feedSort === "popular") {
        const likesDifference = (b.likes || 0) - (a.likes || 0);
        if (likesDifference) return likesDifference;
      }
      return (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0);
    });
    feed.replaceChildren();
    if (!visible.length) {
      const empty = document.createElement("p");
      const hasActiveFilter = feedRegionFilter !== "all" || categoryFilter !== "all" || Boolean($("#search-input").value.trim()) || showMine;
      empty.textContent = hasActiveFilter ? text[language].noResults : text[language].noPosts;
      feed.append(empty);
      $("#feed-load-more").hidden = true;
      if (!$("#search-input").value.trim()) {
        const categoryHasNoResults = categoryFilter !== "all";
        $("#search-status").textContent = categoryHasNoResults ? text[language].noResults : "";
        $("#search-reset").hidden = !categoryHasNoResults;
      } else if (activeSearchPostIds !== null) {
        $("#search-status").textContent = text[language].noResults;
        $("#search-reset").hidden = false;
      }
      return;
    }
    if (!$("#search-input").value.trim()) {
      $("#search-status").textContent = "";
      $("#search-reset").hidden = true;
    }
    visible.slice(0, feedPostLimit).forEach((post) => feed.append(makeCard(post)));
    $("#feed-load-more").hidden = visible.length <= feedPostLimit;
  }

  // 상세 모달은 게시글 데이터에서 안전하게 DOM을 만들어 내용을 표시합니다.
  function renderPostDetail(post) {
    if (!post || isBlockedContent(post) || isPostHidden(post)) return;
    activeDetailPostId = String(post.id);
    const photo = $("#post-detail-photo");
    photo.hidden = !post.photo; photo.src = post.photo || ""; photo.alt = text[language].photoAlt;
    setText("#post-detail-title", post.place);
    const profile = getProfile(post.authorId || "");
    const authorId = userIdForPost(post);
    const avatar = $("#post-detail-avatar"); avatar.src = profile?.photo || post.authorPhoto || avatarSource({ nickname: post.nickname }); avatar.alt = `${post.nickname} ${text[language].profilePhotoAlt}`;
    $("#post-detail-profile-link").dataset.profileId = authorId;
    $("#post-detail-author-name").dataset.profileId = authorId;
    setText("#post-detail-author-name", post.nickname);
    const followButton = $("#post-detail-follow-button");
    followButton.hidden = authorId === currentUserId;
    followButton.dataset.followUser = authorId;
    followButton.textContent = getFollowingIds(currentUserId).includes(authorId) ? text[language].followed : text[language].follow;
    const regionName = locales[post.region]?.name[language] || post.city || post.region;
    setText("#post-detail-place-category", `${regionName} · ${categories[language][post.category] || post.category}`);
    setText("#post-detail-created-at", `${text[language].postDateLabel}: ${formatPostDate(post.createdAt)}${post.editedAt ? ` ${text[language].edited}` : ""}`);
    setText("#post-detail-story", post.story);
    $("#post-detail-story-translation").hidden = true;
    $("#post-detail-story-translation").textContent = "";
    const translationButton = $('[data-translate-target="post-detail-story"]');
    translationButton.textContent = text[language].translate;
    translationButton.dataset.sourceLanguage = getPublicProfile(authorId).residence === "tokyo" ? "ja" : "ko";
    translationButton.dataset.translation = "";
    translationButton.dataset.translated = "false";
    const liked = (post.likedBy || []).includes(currentUserId) || getLikedPostIds().includes(post.id);
    setText("#post-detail-like", `💙 ${text[language].like} (${post.likes || 0})${liked ? " ✓" : ""}`);
    const saved = getBookmarks().includes(String(post.id));
    setText("#post-detail-bookmark", `🔖 ${saved ? text[language].unsaved : text[language].saved}`);
    setText("#post-detail-report", text[language].report);
    $("#post-detail-report").dataset.reportType = "post";
    $("#post-detail-edit").hidden = userIdForPost(post) !== currentUserId || post.isExample;
    setText("#post-detail-edit", text[language].editPost);
    setText("#post-detail-share", `🔗 ${text[language].shareCount} (${post.shares || 0})`);
    const list = $("#post-detail-comments"); list.replaceChildren();
    (post.comments || []).forEach((comment, index) => {
      if (getBlockedIds().includes(comment.userId || userIdForNickname(comment.nickname))) return;
      const item = document.createElement("li");
      const body = document.createElement("span"); body.id = `comment-${post.id}-${index}`; body.textContent = comment.text || "";
      item.append(makeProfileLink(comment.nickname, comment.userId || userIdForNickname(comment.nickname), "profile-link-name"), document.createTextNode(": "), body);
      if (comment.photo) {
        const image = document.createElement("img"); image.className = "comment-photo-thumb"; image.src = comment.photo;
        image.alt = text[language].commentPhotoAlt; image.dataset.commentPhoto = "true"; item.append(image);
      }
      if (isOwnComment(post, comment)) appendCommentActions(item, index, comment);
      addCommentExtras(item, post, comment, index);
      list.append(item);
    });
    if (!list.children.length) { const empty = document.createElement("li"); empty.className = "detail-no-comments"; empty.textContent = text[language].noComments; list.append(empty); }
  }

  // 카드를 선택하면 해당 핀으로 지도를 옮기고 상세 창을 엽니다.
  function openPostDetail(post) {
    if (!post) return;
    if (isBlockedContent(post)) { alert(text[language].blockedEmpty); return; }
    if (isPostHidden(post)) { alert(text[language].hiddenPost); return; }
    clearCommentPhotoDraft();
    detailBackToProfile = Boolean(viewingProfileId && viewingProfileId !== currentUserId);
    $("#post-detail-back").hidden = !detailBackToProfile;
    if (post.region !== currentRegion) switchRegion(post.region);
    if (map && Number.isFinite(post.lat) && Number.isFinite(post.lng)) map.setView([post.lat, post.lng], Math.max(map.getZoom(), 16));
    renderPostDetail(post); $("#post-detail-modal").hidden = false;
  }

  /* 지도에 현재 지역의 게시글 핀을 표시합니다. */
  function renderMarkers() {
    if (!map) return;
    markers.forEach((marker) => marker.remove());
    markers = [];
    posts.filter((post) =>
    !isPostHidden(post) && !isBlockedContent(post) &&
      post.region === currentRegion &&
      (categoryFilter === "all" || post.category === categoryFilter) &&
      (activeSearchPostIds === null || activeSearchPostIds.includes(String(post.id))) &&
      Number.isFinite(post.lat) && Number.isFinite(post.lng)
    ).forEach((post) => {
      const color = categoryColors[post.category] || "#72838B";
      const marker = L.marker([post.lat, post.lng], {
        icon: L.divIcon({
          className: "category-marker-wrap",
          html: `<span class="category-marker" style="--marker-color:${color}"></span>`,
          iconSize: [30, 36],
          iconAnchor: [15, 34]
        })
      }).addTo(map);
      marker.bindPopup(`<strong>${escapeHtml(post.place)}</strong><br>${escapeHtml(post.nickname)}`);
      marker.on("click", () => {
        focusPost(post);
        openPostDetail(post);
      });
      markers.push(marker);
    });
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }

  /* 지역 버튼을 누르면 각 도시의 지도 좌표로 이동합니다. */
  function switchRegion(region) {
    if (!locales[region] || !map) return;
    currentRegion = region;
    map.setView(locales[region].center, locales[region].zoom);
    if (searchMarker) { searchMarker.remove(); searchMarker = null; }
    $$('[data-region]').forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.region === region)));
    renderMarkers();
    renderFeed();
    if (!composePanel.hidden) $("#post-region").value = region;
  }

  // 앱 글 검색은 전체 지역의 게시글 중 선택 카테고리에 해당하는 내용만 찾습니다.
  function findAppPosts(query) {
    const needle = query.trim().toLocaleLowerCase(language);
    return posts.filter((post) => !isPostHidden(post) && !isBlockedContent(post) && (() => {
      if (categoryFilter !== "all" && post.category !== categoryFilter) return false;
      const searchable = [post.title, post.place, post.story, post.nickname]
        .filter(Boolean).join(" ").toLocaleLowerCase(language);
      return searchable.includes(needle);
    })());
  }

  // 입력 중에는 앱 글 결과만 갱신하고, 외부 장소 검색은 제출할 때만 요청합니다.
  function refreshPostSearch(query) {
    feedPostLimit = 10;
    if (!query.trim()) {
      activeSearchPostIds = null;
      lastSearchResults = [];
      $("#search-status").textContent = "";
      $("#search-reset").hidden = true;
    } else {
      lastSearchResults = findAppPosts(query);
      activeSearchPostIds = lastSearchResults.map((post) => String(post.id));
      $("#search-status").textContent = lastSearchResults.length ? "" : text[language].noResults;
      $("#search-reset").hidden = lastSearchResults.length > 0;
    }
    renderSearchResults(lastSearchResults);
    renderMarkers();
    renderFeed();
  }

  // 검색 초기화는 카테고리도 전체로 돌려 결과 제한을 남기지 않습니다.
  function resetSearch() {
    if (searchRequest) searchRequest.abort();
    searchRequest = null;
    if (searchMarker) { searchMarker.remove(); searchMarker = null; }
    $("#search-input").value = "";
    categoryFilter = "all";
    refreshPostSearch("");
    renderCategoryControls();
    map?.setView(locales[currentRegion].center, locales[currentRegion].zoom);
  }

  /* OSM Nominatim으로 한국과 일본을 포함한 전 세계 장소를 찾습니다. */
  async function searchPlace(query) {
    const status = $("#search-status");
    const w = text[language];
    if (!query.trim()) { refreshPostSearch(""); return; }
    if (searchRequest) searchRequest.abort();
    lastSearchResults = findAppPosts(query);
    renderSearchResults(lastSearchResults);
    if (lastSearchResults.length) {
      activeSearchPostIds = lastSearchResults.map((post) => String(post.id));
      status.textContent = "";
      $("#search-reset").hidden = true;
      if (lastSearchResults[0].region !== currentRegion) switchRegion(lastSearchResults[0].region);
      const first = lastSearchResults[0];
      if (map && Number.isFinite(first.lat) && Number.isFinite(first.lng)) map.setView([first.lat, first.lng], 16);
      renderMarkers();
      renderFeed();
      return;
    }
    activeSearchPostIds = null;
    renderMarkers();
    renderFeed();
    const request = new AbortController();
    searchRequest = request;
    $("#search-reset").hidden = true;
    status.textContent = w.searching;
    try {
      /* Nominatim 사용 정책에 맞춰 연속 요청 간격을 1초 이상 둡니다. */
      const wait = Math.max(0, 1100 - (Date.now() - lastSearchTime));
      if (wait) await new Promise((resolve) => setTimeout(resolve, wait));
      lastSearchTime = Date.now();
      const params = new URLSearchParams({ format: "jsonv2", q: query.trim(), limit: "1", addressdetails: "1", "accept-language": language });
      const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
        headers: { Accept: "application/json" }, signal: request.signal
      });
      if (!response.ok) throw new Error(`Nominatim returned ${response.status}`);
      const results = await response.json();
      if (!results.length) { status.textContent = w.noResults; $("#search-reset").hidden = false; return; }
      const result = results[0];
      const point = [Number(result.lat), Number(result.lon)];
      if (!Number.isFinite(point[0]) || !Number.isFinite(point[1])) { status.textContent = w.noResults; $("#search-reset").hidden = false; return; }
      map.setView(point, 16);
      if (searchMarker) searchMarker.remove();
      searchMarker = L.marker(point).addTo(map);
      searchMarker.bindPopup(`<strong>${escapeHtml(query.trim())}</strong><br>${escapeHtml(result.display_name)}`).openPopup();
      status.textContent = "";
      $("#search-reset").hidden = true;
    } catch (error) {
      if (error.name === "AbortError") return;
      console.error("장소 검색에 실패했습니다.", error);
      status.textContent = w.searchError;
      $("#search-reset").hidden = false;
    }
  }

  /* 지도를 만들고, 지도 빈 곳을 누르면 그 지점에서 글쓰기를 시작합니다. */
  function initializeMap() {
    if (!window.L) { mapElement.textContent = "Leaflet 지도를 불러오지 못했습니다."; return; }
    map = L.map(mapElement, { zoomControl: true }).setView(locales[currentRegion].center, locales[currentRegion].zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);
    map.on("click", (event) => openCompose({ lat: event.latlng.lat, lng: event.latlng.lng }));
    renderMarkers();
    /* 처음 지도 크기가 정해진 뒤 Leaflet에 화면 크기를 알려줍니다. */
    setTimeout(() => map.invalidateSize(), 0);
  }

  /* 선택한 사진을 읽어 게시글에 함께 저장합니다. */
  function readPhoto(file) {
    if (!file) return Promise.resolve("");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  // 댓글 사진은 최대 변을 800px로 맞춰 브라우저 저장 공간을 아낍니다.
  async function readResizedPhoto(file) {
    const source = await readPhoto(file);
    if (!source) return "";
    const image = await new Promise((resolve, reject) => {
      const element = new Image(); element.onload = () => resolve(element); element.onerror = reject; element.src = source;
    });
    const ratio = Math.min(1, 800 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
    const context = canvas.getContext("2d");
    context.fillStyle = "#fff"; context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  }

  /* 새 게시글 저장과 입력 폼 제출을 처리합니다. */
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!$("#posting-agreement").checked) { $("#posting-agreement").focus(); return; }
    const nickname = $("#nickname").value.trim();
    const region = $("#post-region").value;
    let photo = "";
    const previousPost = postEditId ? posts.find((entry) => String(entry.id) === postEditId) : null;
    try { photo = $("#photo").files[0] ? await readPhoto($("#photo").files[0]) : previousPost?.photo || ""; }
    catch (error) { console.warn("사진을 읽지 못했습니다.", error); }
    const place = $("#place").value.trim(), story = $("#story").value.trim();
    if ([...place].length > 50 || [...story].length > 1000) {
      setText("#post-form-status", [...place].length > 50 ? text[language].titleLimit : text[language].storyLimit);
      return;
    }
    if (!previousPost) {
      const normalized = `${place}\n${story}`.replace(/\s+/g, " ").trim().toLocaleLowerCase();
      const ownRecent = posts.filter((entry) => userIdForPost(entry) === currentUserId && !entry.isExample)
        .sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0));
      const repeats = ownRecent.findIndex((entry) => `${entry.place}\n${entry.story}`.replace(/\s+/g, " ").trim().toLocaleLowerCase() !== normalized);
      if (repeats === -1 && ownRecent.length >= 4 || repeats >= 4) {
        setText("#post-form-status", text[language].spamBlocked);
        return;
      }
    }
    if (previousPost) {
      previousPost.place = place;
      previousPost.story = story;
      previousPost.region = region;
      previousPost.category = $("#category").value;
      previousPost.photo = photo;
      previousPost.editedAt = new Date().toISOString();
      savePosts();
      closeCompose();
      renderFeed(); renderMarkers();
      return;
    }
    const post = {
      id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      nickname, region, place, category: $("#category").value,
      story, photo, authorId: currentUserId, authorPhoto: getProfile(currentUserId)?.photo || "",
      lat: draftLocation?.lat ?? locales[region].center[0],
      lng: draftLocation?.lng ?? locales[region].center[1],
      likes: 0, reactions: [], comments: [], createdAt: new Date().toISOString(), isExample: false
    };
    posts.unshift(post);
    currentNickname = nickname;
    try { localStorage.setItem(PROFILE_KEY, nickname); } catch (_) { /* 저장이 막힌 브라우저에서도 이어서 사용합니다. */ }
    savePosts();
    form.reset();
    $("#post-submit-button").disabled = true;
    closeCompose();
    switchRegion(region);
    feedSheet.classList.remove("is-collapsed");
    $("#feed-toggle").setAttribute("aria-expanded", "true");
    renderMarkers(); renderFeed();
  });
  function updatePostCharCounts() {
    setText("#post-title-count", text[language].charsRemaining(Math.max(0, 50 - [...$("#place").value].length)));
    setText("#post-story-count", text[language].charsRemaining(Math.max(0, 1000 - [...$("#story").value].length)));
  }
  $("#place")?.addEventListener("input", updatePostCharCounts);
  $("#story")?.addEventListener("input", updatePostCharCounts);

  /* 카드의 좋아요, 이모티콘, 댓글, 삭제 버튼을 처리합니다. */
  feed.addEventListener("click", (event) => {
    if (event.target.closest("img[data-comment-photo]")) return;
    const follow = event.target.closest("[data-follow-user]");
    if (follow) { toggleFollow(follow.dataset.followUser); return; }
    const profileLink = event.target.closest("[data-profile-id]");
    if (profileLink) { openUserProfile(profileLink.dataset.profileId, { kind: "map" }); return; }
    const card = event.target.closest("[data-post-id]");
    if (!card) return;
    const commentAction = event.target.closest("[data-comment-action]");
    if (commentAction) {
      updateComment(card.dataset.postId, Number(commentAction.dataset.commentIndex), commentAction.dataset.commentAction);
      return;
    }
    const button = event.target.closest("button[data-action]");
    const post = posts.find((item) => item.id === card.dataset.postId);
    if (!post) return;
    if (isPostHidden(post)) { alert(text[language].hiddenPost); return; }
    if (button?.dataset.action === "map") { focusPostOnMap(post); return; }
    if (!button) {
      openPostDetail(post);
      return;
    }
    if (button.dataset.action === "share") { sharePost(post); return; }
    if (button.dataset.action === "bookmark") {
      const saved = getBookmarks(), id = String(post.id);
      saveBookmarks(saved.includes(id) ? saved.filter((entry) => entry !== id) : [...saved, id]);
      renderFeed(); return;
    }
    if (button.dataset.action === "edit") { openCompose(null, post); return; }
    if (button.dataset.action === "report") return;
    if (button.dataset.action === "like") {
      post.likedBy = post.likedBy || [];
      if (!post.likedBy.includes(currentUserId)) {
        post.likedBy.push(currentUserId); post.likes = (post.likes || 0) + 1;
        addNotification(userIdForPost(post), "like", currentUserId, post.id);
      }
      const liked = getLikedPostIds(); if (!liked.includes(post.id)) saveLikedPostIds([...liked, post.id]);
    }
    if (button.dataset.action === "reaction") {
      const options = ["💙", "😊", "☕", "🌿", "😋", "📚", "🎉"];
      const choice = prompt(language === "ko" ? `반응 이모티콘을 골라주세요: ${options.join(" ")}` : `絵文字を選んでください: ${options.join(" ")}`, "💙");
      if (choice) post.reactions = [...(post.reactions || []), choice.slice(0, 8)];
    }
    if (button.dataset.action === "comment") {
      const comment = prompt(text[language].commentPrompt);
      if (comment?.trim()) {
        post.comments = [...(post.comments || []), { id: `comment-${Date.now()}`, userId: currentUserId, nickname: currentNickname || (language === "ko" ? "이웃" : "ご近所さん"), text: [...comment.trim()].slice(0, 500).join("") }];
        addNotification(userIdForPost(post), "comment", currentUserId, post.id);
      }
    }
    if (button.dataset.action === "delete") {
      if (!confirm(text[language].deleteConfirm)) return;
      posts = posts.filter((item) => item.id !== post.id);
    }
    savePosts(); renderFeed(); renderMarkers();
  });
  feed.addEventListener("keydown", (event) => {
    if ((event.key !== "Enter" && event.key !== " ") || event.target.closest("button")) return;
    const card = event.target.closest(".post-card");
    if (card) { event.preventDefault(); openPostDetail(posts.find((item) => String(item.id) === card.dataset.postId)); }
  });
  function clearCommentPhotoDraft() {
    commentPhotoDraft = ""; $("#comment-photo-file").value = ""; $("#comment-photo-preview").removeAttribute("src"); $("#comment-photo-preview-wrap").hidden = true;
  }
  const closePostDetail = () => { $("#post-detail-modal").hidden = true; activeDetailPostId = ""; clearCommentPhotoDraft(); };
  $("#post-detail-close")?.addEventListener("click", closePostDetail);
  $("#post-detail-back")?.addEventListener("click", closePostDetail);
  $("#post-detail-modal")?.addEventListener("click", (event) => {
    const follow = event.target.closest("[data-follow-user]");
    if (follow) { toggleFollow(follow.dataset.followUser); return; }
    const profileLink = event.target.closest("[data-profile-id]");
    if (profileLink) openUserProfile(profileLink.dataset.profileId, { kind: "detail", postId: activeDetailPostId });
  });
  $("#post-detail-modal")?.addEventListener("click", (event) => { if (event.target === $("#post-detail-modal")) closePostDetail(); });
  $("#comment-photo-attach")?.addEventListener("click", () => $("#comment-photo-file").click());
  $("#comment-photo-file")?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0]; if (!file) return;
    try {
      commentPhotoDraft = await readResizedPhoto(file);
      $("#comment-photo-preview").src = commentPhotoDraft;
      $("#comment-photo-preview-wrap").hidden = false;
      $("#post-detail-comment-status").textContent = "";
    } catch (error) { console.warn("댓글 사진을 읽지 못했습니다.", error); alert(text[language].saveError); }
    event.target.value = "";
  });
  $("#comment-photo-remove")?.addEventListener("click", clearCommentPhotoDraft);
  $("#comment-photo-viewer-close")?.addEventListener("click", () => { $("#comment-photo-viewer").hidden = true; });
  $("#comment-photo-viewer")?.addEventListener("click", (event) => { if (event.target === $("#comment-photo-viewer")) $("#comment-photo-viewer").hidden = true; });
  document.addEventListener("click", (event) => {
    const image = event.target.closest("img[data-comment-photo]"); if (!image) return;
    $("#comment-photo-viewer-image").src = image.src; $("#comment-photo-viewer").hidden = false;
  });
  $("#post-detail-like")?.addEventListener("click", () => {
    const post = posts.find((item) => String(item.id) === activeDetailPostId); if (!post) return;
    post.likedBy = post.likedBy || [];
    if (!post.likedBy.includes(currentUserId)) {
      post.likedBy.push(currentUserId); post.likes = (post.likes || 0) + 1;
      addNotification(userIdForPost(post), "like", currentUserId, post.id);
    }
    const liked = getLikedPostIds(); if (!liked.includes(post.id)) saveLikedPostIds([...liked, post.id]);
    savePosts(); renderFeed(); renderPostDetail(post); renderMarkers();
  });
  $("#post-detail-bookmark")?.addEventListener("click", () => {
    const id = activeDetailPostId, saved = getBookmarks();
    if (!id) return;
    if (saveBookmarks(saved.includes(id) ? saved.filter((entry) => entry !== id) : [...saved, id])) {
      const post = posts.find((item) => String(item.id) === id);
      if (post) renderPostDetail(post);
      renderFeed();
    }
  });
  $("#post-detail-edit")?.addEventListener("click", () => {
    const post = posts.find((item) => String(item.id) === activeDetailPostId);
    if (post && userIdForPost(post) === currentUserId && !post.isExample) {
      $("#post-detail-modal").hidden = true;
      openCompose(null, post);
    }
  });
  $("#post-detail-share")?.addEventListener("click", () => { const post = posts.find((item) => String(item.id) === activeDetailPostId); if (post) sharePost(post); });
  $("#post-detail-comment-form")?.addEventListener("submit", (event) => {
    event.preventDefault(); const post = posts.find((item) => String(item.id) === activeDetailPostId); const body = $("#post-detail-comment-input").value.trim();
    if (!post) return;
    if (!body && !commentPhotoDraft) { $("#post-detail-comment-status").textContent = text[language].commentEmpty; return; }
    post.comments = post.comments || [];
    post.comments.push({ id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`, userId: currentUserId, nickname: currentNickname, text: body, photo: commentPhotoDraft });
    if (!savePosts(text[language].commentSaveError)) { post.comments.pop(); return; }
    addNotification(userIdForPost(post), "comment", currentUserId, post.id);
    $("#post-detail-comment-form").reset(); clearCommentPhotoDraft(); $("#post-detail-comment-status").textContent = ""; renderFeed(); renderPostDetail(post);
  });
  $("#post-detail-comments")?.addEventListener("click", (event) => {
    const action = event.target.closest("[data-comment-action]");
    if (action) updateComment(activeDetailPostId, Number(action.dataset.commentIndex), action.dataset.commentAction);
  });
  document.addEventListener("click", (event) => {
    const translateButton = event.target.closest("[data-translate-target]");
    if (translateButton) {
      const id = translateButton.dataset.translateTarget;
      const sourceElement = document.getElementById(id);
      const output = $$("[data-translation-output]").find((entry) => entry.dataset.translationOutput === id)
        || document.getElementById(`${id}-translation`);
      if (sourceElement && output) translateText(sourceElement.textContent, translateButton, output);
      return;
    }
    const blockButton = event.target.closest("[data-block-user]");
    if (blockButton) {
      const userId = blockButton.dataset.blockUser;
      const isBlocked = getBlockedIds().includes(userId);
      if (!confirm(isBlocked ? text[language].unblockConfirm : text[language].blockConfirm)) return;
      setUserBlocked(userId, !isBlocked);
      if (viewingProfileId) renderProfileStats(viewingProfileId);
      return;
    }
    const unblockButton = event.target.closest("[data-unblock-user]");
    if (unblockButton) {
      if (confirm(text[language].unblockConfirm)) setUserBlocked(unblockButton.dataset.unblockUser, false);
      return;
    }
    const reportButton = event.target.closest("[data-report-type]");
    if (reportButton) {
      const type = reportButton.dataset.reportType;
      const card = reportButton.closest("[data-post-id]");
      const postId = reportButton.dataset.reportPostId || card?.dataset.postId || activeDetailPostId;
      const commentIndex = Number(reportButton.dataset.reportCommentIndex ?? -1);
      const userId = reportButton.dataset.reportUserId || reportButton.dataset.reportUser || (type === "user" ? viewingProfileId : "");
      const post = posts.find((item) => String(item.id) === String(postId));
      const comment = type === "comment" ? post?.comments?.[commentIndex] : null;
      const targetId = type === "user" ? userId : type === "comment" ? String(comment?.id || `${postId}:${commentIndex}`) : String(postId);
      if (type === "user" && userId === currentUserId || type === "post" && post && userIdForPost(post) === currentUserId || type === "comment" && comment && (comment.userId || userIdForNickname(comment.nickname)) === currentUserId) {
        alert(text[language].reportOwn); return;
      }
      openReport(type, targetId, postId, commentIndex);
      return;
    }
    const notificationButton = event.target.closest("[data-notification-id]");
    if (notificationButton) {
      const notices = getNotifications();
      const notice = notices.find((item) => item.id === notificationButton.dataset.notificationId && item.recipientId === currentUserId);
      if (!notice) return;
      notice.read = true; saveNotifications(notices); renderNotifications();
      $("#notifications-panel").hidden = true; $("#notifications-button").setAttribute("aria-expanded", "false");
      $("#welcome-map-screen").hidden = true; $(".map-screen").hidden = false;
      $("#profile-page").hidden = true; viewingProfileId = ""; profileHistory = [];
      const post = posts.find((item) => String(item.id) === notice.postId);
      if (post && !isPostHidden(post) && !isBlockedContent(post)) openPostDetail(post);
      else openUserProfile(notice.actorId, { kind: "map" });
      return;
    }
  });
  $("#report-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!reportTarget || !currentUserId) return;
    const reason = $('input[name="report-reason"]:checked', event.currentTarget)?.value;
    if (!reason) return;
    const reports = getReports();
    const duplicate = reports.some((item) => item.reporterId === currentUserId && item.targetType === reportTarget.type && item.targetId === reportTarget.id && item.postId === reportTarget.postId);
    if (duplicate) { setText("#report-status", text[language].reportDuplicate); $("#report-status").dataset.state = "duplicate"; return; }
    reports.push({ reporterId: currentUserId, targetType: reportTarget.type, targetId: reportTarget.id, postId: reportTarget.postId, reason, createdAt: new Date().toISOString() });
    try { localStorage.setItem(REPORTS_KEY, JSON.stringify(reports)); }
    catch (error) { console.error("신고를 저장하지 못했습니다.", error); setText("#report-status", text[language].storageError); $("#report-status").dataset.state = "storage"; return; }
    setText("#report-status", text[language].reportDone);
    $("#report-status").dataset.state = "done";
    if (reportTarget.type === "post" && reports.filter((item) => item.targetType === "post" && item.targetId === reportTarget.id).length >= 3) {
      const reported = posts.find((item) => String(item.id) === reportTarget.id);
      if (reported) reported.hiddenByReports = true;
      savePosts();
    }
    renderFeed(); renderMarkers();
    if (welcomeMap) renderWelcomeMarkers();
    if (activeDetailPostId === reportTarget.id && reportTarget.type === "post" && isPostHidden(posts.find((item) => String(item.id) === activeDetailPostId) || {})) $("#post-detail-modal").hidden = true;
    window.setTimeout(() => { $("#report-modal").hidden = true; }, 700);
  });
  $("#notifications-button")?.addEventListener("click", () => {
    const panel = $("#notifications-panel"); panel.hidden = !panel.hidden;
    $("#notifications-button").setAttribute("aria-expanded", String(!panel.hidden));
    if (!panel.hidden) renderNotifications();
  });
  $("#notifications-close")?.addEventListener("click", () => { $("#notifications-panel").hidden = true; $("#notifications-button").setAttribute("aria-expanded", "false"); });
  $("#notifications-read-all")?.addEventListener("click", () => {
    const notices = getNotifications().map((item) => item.recipientId === currentUserId ? { ...item, read: true } : item);
    if (saveNotifications(notices)) renderNotifications();
  });
  $("#notifications-panel")?.addEventListener("click", (event) => {
    if (event.target === $("#notifications-panel")) return;
    if (event.target.closest("[data-notification-id]")) return;
  });
  $$("[data-report-close]").forEach((button) => button.addEventListener("click", () => { $("#report-modal").hidden = true; }));
  $("#report-modal")?.addEventListener("click", (event) => { if (event.target === $("#report-modal")) $("#report-modal").hidden = true; });
  $("#tutorial-next")?.addEventListener("click", () => {
    if (tutorialIndex < text[language].tutorialSlides.length - 1) { tutorialIndex += 1; renderTutorial(); }
    else closeTutorial();
  });
  $("#tutorial-prev")?.addEventListener("click", () => { if (tutorialIndex > 0) { tutorialIndex -= 1; renderTutorial(); } });
  $("#tutorial-close")?.addEventListener("click", closeTutorial);
  $("#tutorial-help-button")?.addEventListener("click", showTutorial);

  /* 피드 패널을 눌러 펼치거나 접습니다. */
  function openDiaryPanel(tab = "mine") {
    activeDiaryTab = tab;
    $("#diary-panel").hidden = false;
    $("#diary-toggle").setAttribute("aria-expanded", "true");
    document.body.classList.add("diary-open");
    updateDiaryToggleState();
    renderDiaries();
  }
  function closeDiaryPanel() {
    $("#diary-panel").hidden = true;
    $("#diary-toggle").setAttribute("aria-expanded", "false");
    document.body.classList.remove("diary-open");
    if (diaryLocationSearchRequest) {
      diaryLocationSearchRequest.abort();
      diaryLocationSearchRequest = null;
    }
  }
  $("#diary-toggle")?.addEventListener("click", () => {
    if ($("#diary-panel").hidden) openDiaryPanel();
    else closeDiaryPanel();
  });
  $("#diary-close")?.addEventListener("click", closeDiaryPanel);
  $$("[data-diary-tab]").forEach((button) => button.addEventListener("click", () => {
    activeDiaryTab = button.dataset.diaryTab;
    renderDiaries();
  }));
  $("#diary-location-search-button")?.addEventListener("click", searchDiaryLocation);
  $("#diary-location-query")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchDiaryLocation();
    }
  });
  $("#diary-location-remove")?.addEventListener("click", () => {
    setDiaryLocation(null);
    $("#diary-location-status").textContent = "";
    $("#diary-location-results").replaceChildren();
  });
  $("#diary-location-name")?.addEventListener("input", (event) => {
    if (diaryLocationDraft) diaryLocationDraft.name = [...event.target.value].slice(0, 150).join("");
  });
  $("#diary-body")?.addEventListener("input", (event) => {
    const chars = [...event.target.value];
    if (chars.length > 500) event.target.value = chars.slice(0, 500).join("");
    $("#diary-char-count").textContent = `${[...event.target.value].length} / 500`;
  });
  $("#diary-photo")?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      diaryPhotoDraft = await readResizedPhoto(file);
      setDiaryPhotoPreview(diaryPhotoDraft);
    } catch (error) {
      console.error("일기 사진을 읽지 못했습니다.", error);
      alert(text[language].diaryPhotoError);
    }
    event.target.value = "";
  });
  $("#diary-photo-remove")?.addEventListener("click", () => {
    diaryPhotoDraft = "";
    setDiaryPhotoPreview("");
  });
  $("#diary-cancel-edit")?.addEventListener("click", () => {
    editingDiaryId = "";
    syncDiaryForm();
  });
  $("#diary-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const dateKey = getDiaryDate();
    const diaries = getDiaries();
    const existing = diaries.find((diary) => diary.userId === currentUserId && diary.dateKey === dateKey);
    const editing = existing && !existing.deleted && editingDiaryId === existing.id;
    if (existing && !editing) {
      $("#diary-daily-status").textContent = text[language].diaryTodayExists;
      syncDiaryForm();
      return;
    }
    const body = [...$("#diary-body").value.trim()];
    if (!body.length || body.length > 500) {
      $("#diary-body").focus();
      return;
    }
    const location = diaryLocationDraft
      ? { ...diaryLocationDraft, name: $("#diary-location-name").value.trim() || text[language].diaryLocationSelected }
      : null;
    const mood = $('input[name="diary-mood"]:checked')?.value || "😊";
    const timestamp = new Date().toISOString();
    if (editing) {
      if (existing.userId !== currentUserId || existing.dateKey !== dateKey || existing.deleted) return;
      existing.title = $("#diary-title").value.trim();
      existing.mood = mood;
      existing.body = body.join("");
      existing.photo = diaryPhotoDraft;
      existing.location = location;
      existing.updatedAt = timestamp;
    } else {
      diaries.push({
        id: `diary-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        userId: currentUserId,
        title: $("#diary-title").value.trim(),
        mood,
        body: body.join(""),
        photo: diaryPhotoDraft,
        location,
        dateKey,
        createdAt: timestamp,
        updatedAt: timestamp,
        heartBy: [],
        comments: [],
        deleted: false
      });
    }
    if (!saveDiaries(diaries)) return;
    if (!editing) getFollowerIds(currentUserId).forEach((followerId) => addNotification(followerId, "diary", currentUserId));
    editingDiaryId = "";
    renderDiaries();
    if (viewingProfileId === currentUserId && activeProfileTab === "diary") renderProfileTab();
  });
  $("#diary-content")?.addEventListener("click", (event) => handleDiaryAction(event));
  $("#profile-diary-content")?.addEventListener("click", (event) => handleDiaryAction(event));
  function handleDiaryAction(event) {
    const button = event.target.closest("[data-diary-action]");
    if (!button) return;
    const card = button.closest("[data-diary-id]");
    const diaryId = card?.dataset.diaryId;
    const diaries = getDiaries();
    const diary = diaries.find((entry) => entry.id === diaryId && !entry.deleted);
    if (!diary || !visibleDiaryForViewer(diary)) return;
    if (button.dataset.diaryAction === "location") {
      if (!diary.location) return;
      if (!$("#profile-page").hidden) {
        $("#profile-page").hidden = true;
        $(".map-screen").hidden = false;
        $("#profile-open-button").hidden = false;
        viewingProfileId = "";
        requestAnimationFrame(() => map?.invalidateSize());
      }
      openDiaryPanel("map");
      requestAnimationFrame(() => renderDiaryMap(diary.id));
      return;
    }
    if (button.dataset.diaryAction === "heart") {
      if (diary.userId === currentUserId || !getFollowingIds(currentUserId).includes(diary.userId)) return;
      diary.heartBy = Array.isArray(diary.heartBy) ? diary.heartBy : [];
      diary.heartBy = diary.heartBy.includes(currentUserId)
        ? diary.heartBy.filter((id) => id !== currentUserId)
        : [...diary.heartBy, currentUserId];
      if (saveDiaries(diaries)) { renderDiaries(); if (viewingProfileId) renderProfileDiary(viewingProfileId); }
      return;
    }
    if (button.dataset.diaryAction === "edit") {
      if (diary.userId !== currentUserId || diary.dateKey !== getDiaryDate()) return;
      editingDiaryId = diary.id;
      activeDiaryTab = "mine";
      if (!$("#profile-page").hidden) {
        $("#profile-page").hidden = true;
        $(".map-screen").hidden = false;
        $("#profile-open-button").hidden = false;
        viewingProfileId = "";
        requestAnimationFrame(() => map?.invalidateSize());
      }
      openDiaryPanel("mine");
      return;
    }
    if (button.dataset.diaryAction === "delete") {
      if (diary.userId !== currentUserId || !confirm(text[language].diaryDeleteConfirm)) return;
      diary.deleted = true;
      diary.body = "";
      diary.title = "";
      diary.photo = "";
      diary.location = null;
      diary.heartBy = [];
      diary.comments = [];
      diary.updatedAt = new Date().toISOString();
      if (saveDiaries(diaries)) {
        editingDiaryId = "";
        renderDiaries();
        if (viewingProfileId) renderProfileDiary(viewingProfileId);
        if (viewingProfileId === currentUserId && activeProfileTab === "diary") renderProfileTab();
      }
    }
  }
  document.addEventListener("submit", (event) => {
    const form = event.target.closest("form[data-diary-comment]");
    if (!form) return;
    event.preventDefault();
    const diaryId = form.dataset.diaryComment;
    const diaries = getDiaries();
    const diary = diaries.find((entry) => entry.id === diaryId && !entry.deleted);
    if (!diary || diary.userId === currentUserId || getBlockedIds().includes(diary.userId) || !getFollowingIds(currentUserId).includes(diary.userId)) return;
    const input = $("input", form);
    const commentText = [...input.value.trim()].slice(0, 100).join("");
    if (!commentText) return;
    diary.comments = Array.isArray(diary.comments) ? diary.comments : [];
    diary.comments.push({ userId: currentUserId, nickname: currentNickname, text: commentText, createdAt: new Date().toISOString() });
    if (saveDiaries(diaries)) renderDiaries();
  });
  $("#profile-content")?.addEventListener("click", (event) => {
    if (event.target.closest("[data-diary-action]")) {
      handleDiaryAction(event);
      return;
    }
    const mode = event.target.closest("[data-diary-view]");
    if (mode) {
      diaryViewMode = mode.dataset.diaryView;
      renderProfileTab();
      return;
    }
    const month = event.target.closest("[data-diary-month]");
    if (month) {
      const [year, monthNumber] = diaryMonth.split("-").map(Number);
      const next = new Date(Date.UTC(year, monthNumber - 1 + Number(month.dataset.diaryMonth), 1, 12));
      diaryMonth = `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}`;
      renderProfileTab();
      return;
    }
    const date = event.target.closest("[data-diary-date]");
    if (date) {
      const diary = getDiaries().find((entry) => entry.userId === currentUserId && entry.dateKey === date.dataset.diaryDate && !entry.deleted);
      if (diary) $(`[data-diary-id="${diary.id}"]`, $("#profile-content"))?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
  function scheduleDiaryMidnight() {
    window.clearTimeout(diaryMidnightTimer);
    const now = Date.now();
    const localNow = new Date(now + 9 * 60 * 60 * 1000);
    const nextUtc9Midnight = Date.UTC(localNow.getUTCFullYear(), localNow.getUTCMonth(), localNow.getUTCDate() + 1) - 9 * 60 * 60 * 1000;
    diaryMidnightTimer = window.setTimeout(() => {
      updateDiaryToggleState();
      if (!$("#diary-panel").hidden) renderDiaries();
      if (viewingProfileId === currentUserId && activeProfileTab === "diary") renderProfileTab();
      scheduleDiaryMidnight();
    }, Math.max(1000, nextUtc9Midnight - now + 250));
  }
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      updateDiaryToggleState();
      if (!$("#diary-panel").hidden) renderDiaries();
      if (viewingProfileId === currentUserId && activeProfileTab === "diary") renderProfileTab();
      scheduleDiaryMidnight();
    }
  });
  scheduleDiaryMidnight();

  /* 피드 패널을 눌러 펼치거나 접습니다. */
  $("#feed-toggle")?.addEventListener("click", () => {
    const collapsed = feedSheet.classList.toggle("is-collapsed");
    $("#feed-toggle").setAttribute("aria-expanded", String(!collapsed));
  });
  $$("[data-feed-region]").forEach((button) => button.addEventListener("click", () => {
    feedRegionFilter = button.dataset.feedRegion;
    feedPostLimit = 10;
    showMine = false;
    applyLanguage();
  }));
  $$("[data-feed-sort]").forEach((button) => button.addEventListener("click", () => {
    feedSort = button.dataset.feedSort;
    feedPostLimit = 10;
    applyLanguage();
  }));
  $("#feed-load-more")?.addEventListener("click", () => {
    feedPostLimit += 10;
    renderFeed();
  });

  /* 검색은 Enter 또는 검색 버튼으로 실행합니다. */
  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    searchPlace($("#search-input").value);
  });
  $("#search-input")?.addEventListener("input", (event) => {
    if (searchRequest) searchRequest.abort();
    searchRequest = null;
    refreshPostSearch(event.target.value);
  });
  $$("[data-category-filter]").forEach((button) => button.addEventListener("click", () => {
    if (searchRequest) searchRequest.abort();
    searchRequest = null;
    categoryFilter = button.dataset.categoryFilter;
    feedPostLimit = 10;
    renderCategoryControls();
    refreshPostSearch($("#search-input").value);
  }));
  $("#search-reset")?.addEventListener("click", resetSearch);
  $("#search-results")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-search-post-id]");
    if (!button) return;
    const post = posts.find((item) => String(item.id) === button.dataset.searchPostId);
    if (!post) return;
    if (post.region !== currentRegion) switchRegion(post.region);
    if (map && Number.isFinite(post.lat) && Number.isFinite(post.lng)) map.setView([post.lat, post.lng], 16);
    focusPost(post);
    openPostDetail(post);
  });

  /* 도시 빠른 이동과 언어 전환 버튼을 연결합니다. */
  $$('[data-region]').forEach((button) => button.addEventListener("click", () => switchRegion(button.dataset.region)));
  $$('header nav button').forEach((button) => button.addEventListener("click", () => {
    language = button.lang === "ja" ? "ja" : "ko";
    try { localStorage.setItem(LANGUAGE_KEY, language); } catch (_) { /* 이 화면이 열려 있는 동안 언어를 적용합니다. */ }
    applyLanguage();
  }));

  /* 마이페이지는 입력한 닉네임과 같은 글만 피드에 보여줍니다. */
  $("#mypage-button")?.addEventListener("click", () => {
    if (showMine) { showMine = false; renderFeed(); applyLanguage(); return; }
    let savedName = "";
    try { savedName = localStorage.getItem(PROFILE_KEY) || ""; } catch (_) { /* 저장소 사용이 막힌 경우 */ }
    const name = prompt(text[language].askNickname, currentNickname || savedName);
    if (!name?.trim()) return;
    currentNickname = name.trim();
    try { localStorage.setItem(PROFILE_KEY, currentNickname); } catch (_) { /* 선택 기능 */ }
    showMine = true; renderFeed(); applyLanguage();
  });

  $("#compose-button")?.addEventListener("click", () => openCompose());
  $("#posting-agreement")?.addEventListener("change", (event) => { $("#post-submit-button").disabled = !event.target.checked; });
  $("#close-compose")?.addEventListener("click", closeCompose);
  /* 프로필 등록 단계에서는 닉네임 중복과 사진 미리보기를 확인합니다. */
  $("#setup-nickname")?.addEventListener("input", () => {
    const name = $("#setup-nickname").value.trim();
    setAvatar($("#setup-avatar"), { nickname: name || "?", photo: profilePhotoDraft });
    $("#setup-status").textContent = name && !nicknameAvailable(name) ? text[language].nicknameTaken : "";
  });
  $("#setup-photo")?.addEventListener("change", async () => { profilePhotoDraft = await readPhoto($("#setup-photo").files[0]) || ""; setAvatar($("#setup-avatar"), { nickname: $("#setup-nickname").value, photo: profilePhotoDraft }); });
  $("#start-button")?.addEventListener("click", () => {
    const result = saveProfile($("#setup-nickname").value, profilePhotoDraft, $("#setup-residence").value);
    if (!result.ok) { $("#setup-status").textContent = result.message; return; }
    const firstSignup = pendingSignupProfile;
    pendingSignupProfile = false;
    $("#profile-setup-screen").hidden = true;
    $("#profile-open-button").hidden = false;
    setText("#signed-in-name", currentNickname);
    applyLanguage();
    showWelcomeMap();
    if (firstSignup && !readUserMap(TUTORIAL_KEY)[currentUserId]) window.setTimeout(showTutorial, 0);
  });
  $("#profile-open-button")?.addEventListener("click", openProfilePage);
  $("#home-logo")?.addEventListener("click", showWelcomeMap);
  $("#welcome-map-start")?.addEventListener("click", () => {
    $("#welcome-map-screen").hidden = true;
    $(".map-screen").hidden = false;
    $("#profile-open-button").hidden = false;
    renderMarkers();
    renderFeed();
    requestAnimationFrame(() => map?.invalidateSize());
    openPendingSharedPost();
  });
  $("#back-to-map")?.addEventListener("click", returnFromProfile);
  $("#edit-profile-button")?.addEventListener("click", () => { const editor = $("#edit-profile-form"); editor.hidden = !editor.hidden; });
  $("#edit-photo")?.addEventListener("change", async () => { profilePhotoDraft = await readPhoto($("#edit-photo").files[0]) || ""; setAvatar($("#edit-avatar-preview"), { nickname: $("#edit-nickname").value, photo: profilePhotoDraft }); });
  $("#edit-profile-form")?.addEventListener("submit", (event) => {
    event.preventDefault(); const result = saveProfile($("#edit-nickname").value, profilePhotoDraft, $("#edit-residence").value);
    if (!result.ok) { $("#edit-profile-status").textContent = result.message; return; }
    $("#edit-profile-status").textContent = ""; setText("#profile-name", currentNickname); setAvatar($("#profile-avatar"), getProfile(currentUserId));
    setText("#signed-in-name", currentNickname); $("#edit-profile-form").hidden = true; renderProfileTab(); applyLanguage();
  });
  $("#profile-follow-button")?.addEventListener("click", (event) => toggleFollow(event.currentTarget.dataset.followUser));
  $("#profile-stats")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-follow-list]");
    if (button) renderFollowList(button.dataset.followList);
  });
  $("#follow-list-modal")?.addEventListener("click", (event) => {
    const profileLink = event.target.closest("[data-profile-id]");
    if (profileLink) openUserProfile(profileLink.dataset.profileId);
    if (event.target === $("#follow-list-modal") || event.target.closest("[data-close-follow-list]")) $("#follow-list-modal").hidden = true;
  });
  $$('[data-profile-tab]').forEach((button) => button.addEventListener("click", () => { activeProfileTab = button.dataset.profileTab; renderProfileTab(); }));
  $("#profile-content")?.addEventListener("click", (event) => {
    if (event.target.closest("img[data-comment-photo]")) return;
    if (event.target.closest("[data-report-type]")) return;
    const profileLink = event.target.closest("[data-profile-id]");
    if (profileLink) { openUserProfile(profileLink.dataset.profileId); return; }
    const followButton = event.target.closest("[data-follow-user]");
    if (followButton) { toggleFollow(followButton.dataset.followUser); return; }
    const commentAction = event.target.closest("[data-comment-action]");
    if (commentAction) {
      const profileCard = commentAction.closest("[data-profile-post-id]");
      if (profileCard) updateComment(profileCard.dataset.profilePostId, Number(commentAction.dataset.commentIndex), commentAction.dataset.commentAction);
      return;
    }
    const remove = event.target.closest("[data-profile-delete]");
    if (remove) {
      const id = remove.dataset.profileDelete, post = posts.find((item) => item.id === id);
      if (post && !post.isExample && confirm(text[language].deleteConfirm)) { posts = posts.filter((item) => item.id !== id); savePosts(); renderProfileTab(); renderMarkers(); renderFeed(); }
      return;
    }
    const edit = event.target.closest("[data-profile-edit]");
    if (edit) {
      const post = posts.find((item) => String(item.id) === edit.dataset.profileEdit);
      if (post && userIdForPost(post) === currentUserId) {
        $("#profile-page").hidden = true; $(".map-screen").hidden = false; viewingProfileId = "";
        openCompose(null, post); requestAnimationFrame(() => map?.invalidateSize());
      }
      return;
    }
    const card = event.target.closest("[data-profile-post-id]"); if (!card) return;
    const post = posts.find((item) => item.id === card.dataset.profilePostId);
    if (post && viewingProfileId !== currentUserId) {
      openPostDetail(post);
      return;
    }
    if (post) { viewingProfileId = ""; $("#profile-page").hidden = true; $(".map-screen").hidden = false; switchRegion(post.region); map?.setView([post.lat, post.lng], 16); focusPost(post); requestAnimationFrame(() => map?.invalidateSize()); }
  });
  const logout = () => { demoAuth.logout(); showWelcome(); };
  $("#profile-logout-button")?.addEventListener("click", logout);
  $("#policies-button")?.addEventListener("click", () => openPolicy("menu"));
  $$("[data-policy]").forEach((button) => button.addEventListener("click", () => openPolicy(button.dataset.policy)));
  $$('[data-close-modal]').forEach((button) => button.addEventListener("click", () => { $("#policy-modal").hidden = true; $("#withdraw-modal").hidden = true; }));
  $("#delete-account-button")?.addEventListener("click", () => { $("#withdraw-modal").hidden = false; $("#withdraw-password").value = ""; $("#withdraw-confirm").checked = false; $("#withdraw-submit").disabled = true; $("#withdraw-status").textContent = ""; });
  const updateWithdraw = () => { const account = demoAuth.getAccount(); $("#withdraw-submit").disabled = !($("#withdraw-confirm").checked && account && $("#withdraw-password").value === account.password); };
  $("#withdraw-confirm")?.addEventListener("change", updateWithdraw); $("#withdraw-password")?.addEventListener("input", updateWithdraw);
  $("#withdraw-submit")?.addEventListener("click", () => {
    const userId = currentUserId, account = demoAuth.getAccount(); if (!account || $("#withdraw-submit").disabled) return;
    const previousFollowData = getFollowData();
    if (!removeFollowRelationships(userId)) { alert(text[language].storageError); return; }
    const remainingDiaries = getDiaries().flatMap((diary) => {
      if (diary.userId === userId) return [];
      return [{
        ...diary,
        heartBy: (diary.heartBy || []).filter((id) => id !== userId),
        comments: (diary.comments || []).filter((comment) => comment.userId !== userId)
      }];
    });
    if (!saveDiaries(remainingDiaries)) {
      if (!saveFollowData(previousFollowData)) console.error("탈퇴 취소 후 팔로우 정보를 복구하지 못했습니다.");
      return;
    }
    let oldLikedIds = []; try { oldLikedIds = JSON.parse(localStorage.getItem(LIKES_KEY) || "{}")[userId] || []; } catch (_) {}
    const deletedPostIds = posts.filter((post) => post.authorId === userId || (!post.authorId && post.nickname === currentNickname)).map((post) => String(post.id));
    const deletedCommentIds = posts.flatMap((post) => (post.comments || []).filter((comment) => comment.userId === userId || comment.nickname === currentNickname).map((comment) => String(comment.id || "")));
    posts = posts.filter((post) => post.authorId !== userId && (post.authorId || post.nickname !== currentNickname));
    posts.forEach((post) => { const removedLikes = (post.likedBy || []).filter((id) => id === userId).length || (oldLikedIds.includes(post.id) ? 1 : 0); post.likedBy = (post.likedBy || []).filter((id) => id !== userId); post.likes = Math.max(0, (post.likes || 0) - removedLikes); post.comments = (post.comments || []).filter((comment) => comment.userId !== userId && comment.nickname !== currentNickname); });
    savePosts();
    try {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(demoAuth.getAccounts().filter((item) => item.nickname !== account.nickname)));
      const profiles = getProfiles(); delete profiles[userId]; localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
      const likes = JSON.parse(localStorage.getItem(LIKES_KEY) || "{}"); delete likes[userId]; localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
      const bookmarks = readUserMap(BOOKMARKS_KEY); delete bookmarks[userId];
      Object.keys(bookmarks).forEach((id) => { bookmarks[id] = (bookmarks[id] || []).filter((postId) => !deletedPostIds.includes(String(postId))); });
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
      const blocks = readUserMap(BLOCKS_KEY); delete blocks[userId];
      Object.keys(blocks).forEach((id) => { blocks[id] = (blocks[id] || []).filter((blockedId) => blockedId !== userId); });
      localStorage.setItem(BLOCKS_KEY, JSON.stringify(blocks));
      const notices = getNotifications().filter((item) => item.recipientId !== userId && item.actorId !== userId && !deletedPostIds.includes(item.postId));
      saveNotifications(notices);
      const reports = getReports().filter((item) => item.reporterId !== userId && !(item.targetType === "user" && item.targetId === userId) && !deletedPostIds.includes(item.postId) && !deletedCommentIds.includes(item.targetId));
      localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
      const tutorialSeen = readUserMap(TUTORIAL_KEY); delete tutorialSeen[userId];
      localStorage.setItem(TUTORIAL_KEY, JSON.stringify(tutorialSeen));
      localStorage.removeItem(SESSION_KEY); localStorage.removeItem(PROFILE_KEY); localStorage.removeItem(ACCOUNT_KEY);
    } catch (error) { console.error("탈퇴 후 계정 데이터를 모두 정리하지 못했습니다.", error); }
    $("#withdraw-modal").hidden = true; showWelcome(); $("#auth-status").textContent = text[language].withdrawDone;
  });
  const syncSignupConsent = () => { const all = [...$$('[data-consent]')].every((box) => box.checked); $("#consent-all").checked = all; updateSignupValidation(); };
  $$('[data-consent]').forEach((box) => box.addEventListener("change", syncSignupConsent));
  $("#consent-all")?.addEventListener("change", (event) => { $$('[data-consent]').forEach((box) => { box.checked = event.target.checked; }); syncSignupConsent(); });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!$("#diary-panel").hidden) closeDiaryPanel();
    if (!$("#post-detail-modal").hidden) closePostDetail();
    if (!$("#comment-photo-viewer").hidden) $("#comment-photo-viewer").hidden = true;
    if (!$("#policy-modal").hidden) $("#policy-modal").hidden = true;
    if (!$("#withdraw-modal").hidden) $("#withdraw-modal").hidden = true;
    if (!$("#report-modal").hidden) $("#report-modal").hidden = true;
    if (!$("#tutorial-modal").hidden) closeTutorial();
    if (!$("#notifications-panel").hidden) { $("#notifications-panel").hidden = true; $("#notifications-button").setAttribute("aria-expanded", "false"); }
    if (!composePanel.hidden) closeCompose();
  });

  /* 언어 카드는 선택 즉시 앱 전체 표시 언어로 적용하고 저장합니다. */
  $$('[data-language]').forEach((button) => button.addEventListener("click", () => {
    language = button.dataset.language === "ja" ? "ja" : "ko";
    try { localStorage.setItem(LANGUAGE_KEY, language); } catch (_) { /* 이 탭이 열려 있는 동안은 언어 선택을 유지합니다. */ }
    $("#auth-status").textContent = "";
    applyLanguage();
  }));

  /* 로그인 버튼은 저장된 데모 계정과 닉네임·비밀번호를 비교합니다. */
  $("#auth-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const nickname = $("#auth-nickname").value.trim();
    const password = $("#auth-password").value;
    const result = demoAuth.login(nickname, password);
    if (!result.ok) { $("#auth-status").textContent = result.message; return; }
    showApp(result.nickname, true);
  });

  /* 회원가입 버튼은 현재 브라우저에 데모 계정을 만들고 바로 입장합니다. */
  $("#signup-button")?.addEventListener("click", () => {
    const panel = $("#signup-consents");
    if (!registrationMode) {
      registrationMode = true; panel.hidden = false;
      $("#signup-password-confirm-wrap").hidden = false;
      $("#auth-password-confirm").disabled = false; $("#auth-password-confirm").required = true;
      $("#auth-nickname").setAttribute("autocomplete", "username"); $("#auth-password").setAttribute("autocomplete", "new-password");
      ["#signup-id-hint", "#signup-password-hint", "#signup-password-confirm-hint"].forEach((selector) => { $(selector).hidden = false; });
      applyLanguage(); updateSignupValidation(); return;
    }
    if (![...$$('[data-consent]')].every((box) => box.checked)) { $("#auth-status").textContent = text[language].missingConsent; return; }
    updateSignupValidation();
    if ($("#signup-button").disabled) { $("#auth-status").textContent = text[language].signupFieldsInvalid; return; }
    const authForm = $("#auth-form");
    if (!authForm.reportValidity()) return;
    const nickname = $("#auth-nickname").value.trim();
    const password = $("#auth-password").value;
    if ($("#auth-password-confirm").value !== password) { $("#auth-status").textContent = text[language].signupFieldsInvalid; return; }
    if (!nickname || !password) { $("#auth-status").textContent = text[language].loginFailed; return; }
    const result = demoAuth.signUp(nickname, password);
    if (!result.ok) { $("#auth-status").textContent = result.message; return; }
    $("#auth-status").textContent = text[language].signupDone;
    pendingSignupProfile = true;
    showApp(nickname);
  });

  ["#auth-nickname", "#auth-password", "#auth-password-confirm"].forEach((selector) => $(selector)?.addEventListener("input", () => { $("#auth-status").textContent = ""; updateSignupValidation(); }));

  /* 로그아웃은 인증 세션만 지우고, 다음 로그인을 위한 계정은 남겨 둡니다. */

  applyLanguage();
  const savedSession = demoAuth.getSession();
  const savedAccount = demoAuth.getAccount();
  if (savedSession && savedAccount && savedSession === savedAccount.nickname) showApp(savedSession);
  else showWelcome();
})();
