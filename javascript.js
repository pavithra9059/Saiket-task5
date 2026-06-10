 let blogs = JSON.parse(localStorage.getItem('blogsphere_blogs')) || [];
  let currentUser = { name: "Alex Nebula", email: "alex@blogsphere.com", avatar: "https://randomuser.me/api/portraits/men/32.jpg" };
  let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  let currentEditId = null;

  // Initialize with 12 premium blogs if empty
  if(blogs.length === 0){
    const sampleTitles = ["Neural Interfaces & The Future of Writing", "Metaverse Evolution: Beyond Reality", "AI in Creative Arts", "Quantum Computing Revolution", "Cyberpunk Design Systems", "3D Web & Immersive Experiences", "Glassmorphism Deep Dive 2026", "Future of Blogging: AI Integration", "SaaS Trends for Next Decade", "Immersive UI/UX Principles", "Digital Nomad Lifestyle", "Green Tech Innovations", "Space Tourism Era", "Holographic Displays Arrive", "Web3 & Decentralized Future"];
    const categories = ["Tech","Design","AI","Future","Web3"];
    const authors = ["Alex Nebula", "Sofia Quantum", "Dr. Cyber", "Luna Pixel", "Orion Smith"];
    for(let i=1;i<=14;i++){
      blogs.push({
        id: Date.now() + i,
        title: sampleTitles[i % sampleTitles.length] + " " + i,
        author: authors[i % authors.length],
        date: new Date(Date.now() - i*86400000).toLocaleDateString(),
        category: categories[i % categories.length],
        description: "Explore the cutting-edge fusion of design and technology. A deep dive into futuristic blogging and 3D experiences.",
        content: "This is the full immersive content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Experience the future of reading with interactive 3D elements and holographic insights.",
        image: `https://picsum.photos/id/${(i*3)+10}/400/250`,
        isPublished: i % 2 === 0,
        likes: Math.floor(Math.random() * 180),
      });
    }
    localStorage.setItem('blogsphere_blogs', JSON.stringify(blogs));
  }

  function saveBlogs(){ localStorage.setItem('blogsphere_blogs', JSON.stringify(blogs)); showToast("💾 Saved to cloud (local)"); }
  function showToast(msg){ let t = document.getElementById('toastMsg'); t.innerText = msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2500); }
  
  function getStats(){ return { total: blogs.length, published: blogs.filter(b=>b.isPublished).length, draft: blogs.filter(b=>!b.isPublished).length, totalLikes: blogs.reduce((a,b)=>a+b.likes,0) }; }

  // ---------- RENDERING FUNCTIONS (All buttons working) ----------
  function renderHome(){
    return `<div class="hero" style="height:85vh; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">
      <div style="backdrop-filter:blur(10px); background:rgba(0,0,0,0.3); border-radius:60px; padding:2.5rem; max-width:800px;">
        <h1 id="dynamicTyping" style="font-size:3.5rem; background: linear-gradient(135deg, cyan, magenta); -webkit-background-clip: text; background-clip: text; color:transparent;">BlogSphere X</h1>
        <p style="font-size:1.4rem; margin:1rem;">Create. Publish. Immerse in 3D Future of Blogging</p>
        <div style="display:flex; gap:20px; justify-content:center; flex-wrap:wrap;">
          <button class="neon-btn" id="exploreFromHome"><i class="fas fa-globe"></i> Explore Blogs</button>
          <button class="neon-btn" id="createFromHome"><i class="fas fa-plus-circle"></i> Write New Post</button>
        </div>
      </div>
    </div>`;
  }
  
  function renderBlogs(filterText="", filterCat=""){
    let filtered = blogs.filter(b=> b.title.toLowerCase().includes(filterText.toLowerCase()) && (filterCat==="" || b.category===filterCat));
    if(filtered.length===0) return `<div class="glass-card" style="padding:3rem; text-align:center;">✨ No blogs match. Create a futuristic post!</div>`;
    return `<div class="blogs-grid">`+filtered.map(blog => `
      <div class="blog-card" data-id="${blog.id}">
        <img src="${blog.image}" alt="featured" loading="lazy">
        <span style="background:cyan; color:black; border-radius:20px; padding:4px 12px; font-size:0.8rem;">${blog.category}</span>
        <h3 style="margin-top:12px;">${blog.title}</h3>
        <p><i class="fas fa-user"></i> ${blog.author} | ${blog.date}</p>
        <p>${blog.description.substring(0,80)}...</p>
        <div style="display:flex; gap:12px; margin-top:12px; flex-wrap:wrap;">
          <button class="btn-icon readMoreBtn" data-id="${blog.id}"><i class="fas fa-book-open"></i> Read</button>
          <button class="btn-icon likeBtn" data-id="${blog.id}"><i class="fas fa-heart"></i> ${blog.likes}</button>
          <button class="btn-icon bookmarkBtn" data-id="${blog.id}"><i class="fas ${bookmarks.includes(blog.id) ? 'fa-bookmark' : 'fa-bookmark-o'}"></i></button>
          <button class="btn-icon shareBtn" data-id="${blog.id}"><i class="fas fa-share-alt"></i></button>
          <button class="btn-icon deleteBlogBtn" data-id="${blog.id}" style="color:#ff6b6b;"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>
    `).join('')+`</div>`;
  }
  
  function renderDashboard(){
    let stats = getStats();
    return `<div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1.5rem; margin-bottom:2rem;">
      <div class="stat-card"><i class="fas fa-database fa-2x"></i><h2 class="counter">${stats.total}</h2><p>Total Blogs</p></div>
      <div class="stat-card"><i class="fas fa-check-circle fa-2x"></i><h2 class="counter">${stats.published}</h2><p>Published</p></div>
      <div class="stat-card"><i class="fas fa-edit fa-2x"></i><h2 class="counter">${stats.draft}</h2><p>Drafts</p></div>
      <div class="stat-card"><i class="fas fa-heart fa-2x"></i><h2 class="counter">${stats.totalLikes}</h2><p>Total Likes</p></div>
    </div>
    <h3 style="margin:2rem 0 1rem"><i class="fas fa-clock"></i> Recent Posts</h3>
    <div class="blogs-grid">${blogs.slice(0,3).map(b=>`<div class="glass-card" style="padding:1rem"><h4>${b.title}</h4><p>${b.date} | ${b.category}</p><button class="neon-btn readMoreBtn" data-id="${b.id}" style="padding:8px 16px;">Preview</button></div>`).join('')}</div>`;
  }
  
  function renderCreateEdit(isEdit=false, blog=null){
    let titleVal = isEdit ? blog.title : '';
    let contentVal = isEdit ? blog.content : '';
    let descVal = isEdit ? blog.description : '';
    let catVal = isEdit ? blog.category : 'Tech';
    let imageVal = isEdit ? blog.image : '';
    let publishChecked = isEdit ? blog.isPublished : true;
    return `<div class="glass-card" style="max-width:800px; margin:auto; padding:2rem;">
      <h2>${isEdit ? '✏️ Edit Blog Post' : '🚀 Create New Blog'}</h2>
      <input type="text" id="blogTitle" placeholder="Blog Title *" value="${titleVal.replace(/"/g, '&quot;')}">
      <select id="blogCategory">
        <option ${catVal==='Tech'?'selected':''}>Tech</option><option ${catVal==='Design'?'selected':''}>Design</option>
        <option ${catVal==='AI'?'selected':''}>AI</option><option ${catVal==='Future'?'selected':''}>Future</option><option ${catVal==='Web3'?'selected':''}>Web3</option>
      </select>
      <input type="text" id="blogImage" placeholder="Image URL (optional)" value="${imageVal}">
      <textarea id="blogDesc" rows="2" placeholder="Short Description">${descVal}</textarea>
      <textarea id="blogContent" rows="6" placeholder="Full Content">${contentVal}</textarea>
      <label><input type="checkbox" id="publishCheck" ${publishChecked?'checked':''}> Publish immediately</label><br/>
      <div style="display:flex; gap:12px; margin-top:20px;">
        <button class="neon-btn" id="saveBlogBtn">💾 Save ${isEdit?'Changes':'as Draft / Publish'}</button>
        ${isEdit ? `<button class="neon-btn" id="cancelEditBtn" style="background:#555;">Cancel</button>` : ''}
      </div>
    </div>`;
  }
  
  function renderBlogDetail(blogId){
    let blog = blogs.find(b=>b.id==blogId);
    if(!blog) return "<p>Blog not found</p>";
    return `<div class="glass-card" style="max-width:900px; margin:auto; padding:2rem;">
      <img src="${blog.image}" style="width:100%; border-radius:32px; max-height:400px; object-fit:cover;">
      <h1>${blog.title}</h1>
      <p><i class="fas fa-user"></i> ${blog.author} | ${blog.date} | <i class="fas fa-tag"></i> ${blog.category}</p>
      <div style="margin:30px 0; line-height:1.6;">${blog.content}</div>
      <div style="display:flex; gap:15px;">
        <button class="btn-icon likeBtn" data-id="${blog.id}"><i class="fas fa-heart"></i> ${blog.likes} Likes</button>
        <button class="neon-btn" id="editFromDetail" data-id="${blog.id}"><i class="fas fa-edit"></i> Edit</button>
        <button class="neon-btn delete-btn" id="deleteFromDetail" data-id="${blog.id}"><i class="fas fa-trash"></i> Delete</button>
      </div>
    </div>`;
  }
  
  function renderProfile(){
    let userBlogsCount = blogs.filter(b=>b.author===currentUser.name).length;
    return `<div class="glass-card" style="max-width:600px; margin:auto; text-align:center; padding:2rem;">
      <img src="${currentUser.avatar}" style="width:120px; border-radius:60px; border:3px solid cyan;">
      <h2>${currentUser.name}</h2>
      <p><i class="fas fa-envelope"></i> ${currentUser.email}</p>
      <div style="background:rgba(0,0,0,0.3); border-radius:30px; padding:1rem; margin:20px 0;">
        <h3>📊 Your Activity</h3>
        <p>✍️ Blogs Written: ${userBlogsCount}</p>
        <p>🔖 Bookmarks: ${bookmarks.length}</p>
      </div>
      <button class="neon-btn" id="resetStorageBtn"><i class="fas fa-sync-alt"></i> Reset All Data (Demo)</button>
    </div>`;
  }
  
  function renderContact(){
    return `<div class="glass-card" style="max-width:700px; margin:auto; padding:2rem;">
      <h2><i class="fas fa-paper-plane"></i> Contact Us</h2>
      <input type="text" id="contactName" placeholder="Your Name *">
      <input type="email" id="contactEmail" placeholder="Email Address *">
      <input type="text" id="contactSubject" placeholder="Subject">
      <textarea id="contactMsg" rows="4" placeholder="Your futuristic message..."></textarea>
      <button class="neon-btn" id="sendContactBtn" style="width:100%;"><i class="fas fa-share"></i> Send Message</button>
    </div>`;
  }
  
  // PAGE LOADER WITH EVENT HANDLERS
  function loadPage(page, params={}){
    let content = '';
    if(page === 'home') content = renderHome();
    else if(page === 'blogs') content = `<div><div style="display:flex; gap:15px; flex-wrap:wrap; margin-bottom:25px;"><input type="text" id="searchInput" placeholder="🔍 Search blogs..." style="flex:1;"><select id="categoryFilter" style="width:auto;"><option value="">All Categories</option><option>Tech</option><option>Design</option><option>AI</option><option>Future</option><option>Web3</option></select></div><div id="blogsContainer"></div></div>`;
    else if(page === 'create') content = renderCreateEdit(false);
    else if(page === 'edit') { let blog = blogs.find(b=>b.id==params.id); if(blog) content = renderCreateEdit(true, blog); else loadPage('blogs'); currentEditId = params.id; }
    else if(page === 'details') { let blogId = params.id; content = renderBlogDetail(blogId); }
    else if(page === 'dashboard') content = renderDashboard();
    else if(page === 'profile') content = renderProfile();
    else if(page === 'contact') content = renderContact();
    document.getElementById('main-content').innerHTML = content;
    
    // Attach dynamic events per page
    if(page === 'blogs'){
      const refreshList = () => { 
        let search = document.getElementById('searchInput')?.value||''; 
        let cat = document.getElementById('categoryFilter')?.value||''; 
        document.getElementById('blogsContainer').innerHTML = renderBlogs(search,cat);
        attachCardEvents(); 
      };
      document.getElementById('searchInput')?.addEventListener('input', refreshList);
      document.getElementById('categoryFilter')?.addEventListener('change', refreshList);
      refreshList();
    }
    if(page === 'create' || page === 'edit'){
      document.getElementById('saveBlogBtn').addEventListener('click',()=>{
        let title = document.getElementById('blogTitle').value.trim();
        let category = document.getElementById('blogCategory').value;
        let image = document.getElementById('blogImage').value;
        let desc = document.getElementById('blogDesc').value;
        let contentText = document.getElementById('blogContent').value;
        let isPublished = document.getElementById('publishCheck').checked;
        if(!title) { showToast("❌ Title is required"); return; }
        if(page === 'create'){
          let newBlog = { id: Date.now(), title, author: currentUser.name, date: new Date().toLocaleDateString(), category, description: desc || "No description", content: contentText || "Write amazing content", image: image || 'https://picsum.photos/id/1/400/250', isPublished, likes:0 };
          blogs.push(newBlog);
          saveBlogs(); showToast("✅ Blog Created Successfully!");
          loadPage('blogs');
        } else {
          let idx = blogs.findIndex(b=>b.id===currentEditId);
          if(idx!==-1){ blogs[idx] = {...blogs[idx], title, category, description:desc, content:contentText, image, isPublished}; saveBlogs(); showToast("✏️ Blog Updated!"); loadPage('blogs'); }
        }
      });
      if(page==='edit') document.getElementById('cancelEditBtn')?.addEventListener('click',()=>loadPage('blogs'));
    }
    if(page === 'details'){
      attachCardEvents();
      document.getElementById('editFromDetail')?.addEventListener('click',(e)=>{ let id = parseInt(e.currentTarget.dataset.id); loadPage('edit',{id}); });
      document.getElementById('deleteFromDetail')?.addEventListener('click',(e)=>{ let id = parseInt(e.currentTarget.dataset.id); if(confirm("⚠️ Permanently delete this blog?")){ blogs = blogs.filter(b=>b.id !== id); saveBlogs(); showToast("🗑️ Deleted"); loadPage('blogs'); } });
    }
    if(page === 'profile'){
      document.getElementById('resetStorageBtn')?.addEventListener('click',()=>{ if(confirm("Reset all blogs? This action is irreversible.")){ localStorage.clear(); blogs = []; location.reload(); } });
    }
    if(page === 'contact'){
      document.getElementById('sendContactBtn')?.addEventListener('click',()=>{
        let name = document.getElementById('contactName').value;
        let email = document.getElementById('contactEmail').value;
        let msg = document.getElementById('contactMsg').value;
        if(!name || !email || !msg) showToast("❌ Please fill name, email, and message");
        else { showToast("📨 Message sent! (Demo simulation)"); document.getElementById('contactName').value=''; document.getElementById('contactEmail').value=''; document.getElementById('contactSubject').value=''; document.getElementById('contactMsg').value=''; }
      });
    }
    if(page === 'home'){
      document.getElementById('exploreFromHome')?.addEventListener('click',()=>loadPage('blogs'));
      document.getElementById('createFromHome')?.addEventListener('click',()=>loadPage('create'));
    }
    attachGlobalStaticEvents();
    attachCardEvents();
  }
  
  function attachCardEvents(){
    document.querySelectorAll('.readMoreBtn').forEach(btn=> btn.addEventListener('click',(e)=>{ let id = parseInt(btn.dataset.id); loadPage('details',{id}); }));
    document.querySelectorAll('.likeBtn').forEach(btn=> btn.addEventListener('click',(e)=>{ let id = parseInt(btn.dataset.id); let blog = blogs.find(b=>b.id===id); if(blog){ blog.likes+=1; saveBlogs(); showToast("❤️ Liked!"); loadPage(window.currentPageName || 'blogs'); } }));
    document.querySelectorAll('.bookmarkBtn').forEach(btn=> btn.addEventListener('click',(e)=>{ let id = parseInt(btn.dataset.id); if(bookmarks.includes(id)) bookmarks = bookmarks.filter(b=>b!==id); else bookmarks.push(id); localStorage.setItem('bookmarks',JSON.stringify(bookmarks)); showToast(bookmarks.includes(id)?"🔖 Bookmarked":"Removed bookmark"); loadPage('blogs'); }));
    document.querySelectorAll('.shareBtn').forEach(btn=> btn.addEventListener('click',()=>{ navigator.clipboard.writeText(window.location.href); showToast("🔗 Link copied to clipboard!"); }));
    document.querySelectorAll('.deleteBlogBtn').forEach(btn=> btn.addEventListener('click',(e)=>{ let id = parseInt(btn.dataset.id); if(confirm("Delete this blog?")){ blogs = blogs.filter(b=>b.id !== id); saveBlogs(); showToast("Deleted"); loadPage('blogs'); } }));
  }
  
  function attachGlobalStaticEvents(){
    // Sidebar navigation
    document.querySelectorAll('.sidebar a').forEach(link => {
      link.addEventListener('click',(e)=>{ e.preventDefault(); let page = link.dataset.page; if(page) { loadPage(page); window.currentPageName = page; document.getElementById('sidebar').classList.remove('open'); } });
    });
    document.getElementById('menuToggle').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));
    document.getElementById('darkLightToggle').addEventListener('click',()=>{ document.body.classList.toggle('light-mode'); showToast("🌓 Theme changed"); });
    document.getElementById('globalSearchBtn')?.addEventListener('click',()=>loadPage('blogs'));
  }
  
  // Reading Progress & 3D Background
  window.addEventListener('scroll',()=>{ let winScroll = document.documentElement.scrollTop; let height = document.documentElement.scrollHeight - window.innerHeight; let scrolled = (winScroll/height)*100; document.getElementById('progressBar').style.width = scrolled+'%'; });
  
  // THREE.JS 3D Scene (Futuristic floating shapes)
  function init3D(){
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene(); scene.background = null;
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 6;
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    const torusKnotGeo = new THREE.TorusKnotGeometry(1.2, 0.35, 128, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x0044aa, roughness: 0.2, metalness: 0.9 });
    const knot = new THREE.Mesh(torusKnotGeo, material);
    scene.add(knot);
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);
    const light1 = new THREE.PointLight(0xff44ff, 0.8); light1.position.set(3,4,5);
    const light2 = new THREE.PointLight(0x44ffcc, 0.6); light2.position.set(-3,2,4);
    scene.add(light1); scene.add(light2);
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);
    for(let i=0;i<starCount;i++){ starPositions[i*3] = (Math.random() - 0.5)*200; starPositions[i*3+1] = (Math.random() - 0.5)*100; starPositions[i*3+2] = (Math.random() - 0.5)*80 - 40; }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions,3));
    const starMaterial = new THREE.PointsMaterial({ color: 0x88aaff, size: 0.08 });
    const stars = new THREE.Points(starsGeometry, starMaterial);
    scene.add(stars);
    function animate(){ requestAnimationFrame(animate); knot.rotation.x += 0.008; knot.rotation.y += 0.012; stars.rotation.y += 0.0005; renderer.render(scene, camera); }
    animate();
    window.addEventListener('resize',()=>{ camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth,window.innerHeight); });
  }
  init3D();
  
  // Start with Home Page
  loadPage('home');
  window.currentPageName = 'home';
