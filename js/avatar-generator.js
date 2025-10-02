// ============================================
// SIMPLE AVATAR SYSTEM - Working Implementation
// ============================================

class AvatarGenerator {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.avatar = null;
        this.controls = null;
        this.userData = null;
        
        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.error('Three.js not loaded!');
            return;
        }
        
        this.init();
        this.setupEventListeners();
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    init() {
        const container = document.getElementById('avatar-canvas-container');
        if (!container) return;
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            45,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 1.6, 3);
        this.camera.lookAt(0, 1, 0);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        container.appendChild(this.renderer.domElement);
        
        // Orbit controls
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.target.set(0, 1, 0);
        }
        
        // Lighting
        this.setupLighting();
        
        // Ground plane
        this.addGround();
        
        // Start animation loop
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);
        
        // Rim light
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.2);
        rimLight.position.set(0, 5, -10);
        this.scene.add(rimLight);
    }
    
    addGround() {
        const geometry = new THREE.CircleGeometry(3, 32);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xcccccc,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(geometry, material);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }
    
    setupEventListeners() {
        // Form submission
        const form = document.getElementById('avatar-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(e);
            });
        }
        
        // Rotate buttons
        document.getElementById('rotate-left-btn')?.addEventListener('click', () => {
            if (this.avatar) {
                this.avatar.rotation.y += Math.PI / 4;
            }
        });
        
        document.getElementById('rotate-right-btn')?.addEventListener('click', () => {
            if (this.avatar) {
                this.avatar.rotation.y -= Math.PI / 4;
            }
        });
        
        // Save avatar button
        document.getElementById('save-avatar-btn')?.addEventListener('click', () => {
            this.saveAvatar();
        });
        
        // Try outfit buttons
        document.querySelectorAll('.outfit-item button').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.tryOutfit(index);
            });
        });
    }
    
    // ============================================
    // AVATAR CREATION FROM USER INPUT
    // ============================================
    
    async handleFormSubmit(event) {
        const formData = new FormData(event.target);
        
        // Extract user data
        this.userData = {
            gender: document.getElementById('gender').value,
            age: parseInt(document.getElementById('age').value),
            height: parseInt(document.getElementById('height').value),
            weight: parseInt(document.getElementById('weight').value),
            chest: parseInt(document.getElementById('chest').value) || 0,
            waist: parseInt(document.getElementById('waist').value) || 0,
            skinTone: document.querySelector('.skin-swatches .swatch.selected')?.dataset.color || '#F9E4D4',
            hairStyle: document.getElementById('hairstyle').value,
            hairColor: document.querySelector('.hair-swatches .swatch.selected')?.dataset.color || '#000000',
            facePhoto: document.getElementById('facePhoto').files[0]
        };
        
        // Validate
        if (!this.userData.gender || !this.userData.height || !this.userData.weight) {
            alert('Please fill in all required fields!');
            return;
        }
        
        // Show loading
        this.showLoading(true);
        
        try {
            // Create avatar
            await this.createAvatar(this.userData);
            
            // Hide loading
            this.showLoading(false);
            
            // Show success message
            this.showNotification('Avatar created successfully! 🎉', 'success');
            
            // Update progress bar
            this.updateProgressBar(100);
            
        } catch (error) {
            console.error('Avatar creation failed:', error);
            this.showLoading(false);
            this.showNotification('Failed to create avatar. Please try again.', 'error');
        }
    }
    
    async createAvatar(userData) {
        // If face photo provided, use AI-based avatar
        if (userData.facePhoto) {
            await this.createRealisticAvatarWithFace(userData);
        } else {
            // Use base model with customization
            await this.createBaseAvatar(userData);
        }
    }
    
    // ============================================
    // REALISTIC AVATAR WITH FACE PHOTO
    // ============================================
    
    async createRealisticAvatarWithFace(userData) {
        // Method 1: Ready.Player.Me (Best for realistic avatars)
        // This opens an iframe where user can create avatar from photo
        
        return new Promise((resolve, reject) => {
            // Hide placeholder
            const placeholder = document.querySelector('.avatar-placeholder');
            if (placeholder) placeholder.style.display = 'none';
            
            // Create iframe for Ready.Player.Me
            const iframe = document.createElement('iframe');
            iframe.id = 'rpm-iframe';
            iframe.src = 'https://stylooutfit.readyplayer.me/avatar?frameApi&clearCache';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.style.borderRadius = '16px';
            iframe.allow = 'camera *; microphone *';
            
            const container = document.getElementById('avatar-canvas-container');
            
            // Hide Three.js canvas temporarily
            if (this.renderer.domElement) {
                this.renderer.domElement.style.display = 'none';
            }
            
            container.appendChild(iframe);
            
            // Listen for avatar creation completion
            window.addEventListener('message', async (event) => {
                const json = event.data;
                
                if (json?.source !== 'readyplayerme') return;
                
                // Avatar URL received
                if (json.eventName === 'v1.avatar.exported') {
                    const avatarUrl = json.data.url; // GLB file URL
                    
                    console.log('Avatar created:', avatarUrl);
                    
                    // Remove iframe
                    iframe.remove();
                    
                    // Show Three.js canvas
                    if (this.renderer.domElement) {
                        this.renderer.domElement.style.display = 'block';
                    }
                    
                    // Load the created avatar
                    await this.loadAvatarModel(avatarUrl, userData);
                    
                    resolve();
                }
                
                // Handle errors
                if (json.eventName === 'v1.frame.ready') {
                    console.log('Ready Player Me loaded');
                }
            });
            
            // Timeout after 5 minutes
            setTimeout(() => {
                if (document.getElementById('rpm-iframe')) {
                    reject(new Error('Avatar creation timeout'));
                }
            }, 300000);
        });
    }
    
    // ============================================
    // BASE AVATAR (WITHOUT PHOTO)
    // ============================================
    
    async createBaseAvatar(userData) {
        // Load base model based on gender
        const modelPath = userData.gender === 'male' 
            ? 'https://models.readyplayer.me/64bfa683f3c6a7026d73c8f5.glb' // Sample male model
            : 'https://models.readyplayer.me/64bfa683f3c6a7026d73c8f6.glb'; // Sample female model
        
        await this.loadAvatarModel(modelPath, userData);
    }
    
    // ============================================
    // LOAD 3D MODEL
    // ============================================
    
    async loadAvatarModel(url, userData) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.GLTFLoader();
            
            loader.load(
                url,
                (gltf) => {
                    // Remove old avatar
                    if (this.avatar) {
                        this.scene.remove(this.avatar);
                    }
                    
                    // Add new avatar
                    this.avatar = gltf.scene;
                    this.avatar.position.set(0, 0, 0);
                    this.avatar.castShadow = true;
                    this.avatar.receiveShadow = true;
                    
                    // Apply customizations
                    this.applyBodyMeasurements(userData);
                    this.applySkinTone(userData.skinTone);
                    
                    // Add to scene
                    this.scene.add(this.avatar);
                    
                    // Center camera on avatar
                    this.centerCameraOnAvatar();
                    
                    // Hide placeholder
                    const placeholder = document.querySelector('.avatar-placeholder');
                    if (placeholder) placeholder.style.display = 'none';
                    
                    resolve();
                },
                (progress) => {
                    // Update progress
                    const percent = (progress.loaded / progress.total) * 100;
                    this.updateProgressBar(percent);
                },
                (error) => {
                    console.error('Error loading model:', error);
                    reject(error);
                }
            );
        });
    }
    
    // ============================================
    // APPLY CUSTOMIZATIONS
    // ============================================
    
    applyBodyMeasurements(userData) {
        if (!this.avatar) return;
        
        // Calculate scale factors
        const heightScale = userData.height / 170; // 170cm = average
        const widthScale = Math.sqrt(userData.weight / 70); // 70kg = average
        
        // Apply scale
        this.avatar.scale.set(
            widthScale * 0.9,
            heightScale,
            widthScale * 0.9
        );
        
        // Adjust chest and waist if provided
        if (userData.chest && userData.waist) {
            this.avatar.traverse((child) => {
                if (child.isMesh) {
                    if (child.name.includes('Chest') || child.name.includes('Torso')) {
                        const chestScale = userData.chest / 95; // 95cm = average
                        child.scale.x *= chestScale;
                        child.scale.z *= chestScale;
                    }
                    if (child.name.includes('Waist') || child.name.includes('Hips')) {
                        const waistScale = userData.waist / 80; // 80cm = average
                        child.scale.x *= waistScale;
                        child.scale.z *= waistScale;
                    }
                }
            });
        }
    }
    
    applySkinTone(color) {
        if (!this.avatar) return;
        
        this.avatar.traverse((child) => {
            if (child.isMesh) {
                // Apply to skin materials
                if (child.material && (
                    child.name.includes('Body') ||
                    child.name.includes('Head') ||
                    child.name.includes('Arm') ||
                    child.name.includes('Leg')
                )) {
                    if (child.material.color) {
                        child.material.color.set(color);
                    }
                }
            }
        });
    }
    
    // ============================================
    // OUTFIT TRY-ON
    // ============================================
    
    async tryOutfit(outfitIndex) {
        if (!this.avatar) {
            this.showNotification('Please create your avatar first!', 'warning');
            return;
        }
        
        this.showLoading(true);
        
        try {
            // Remove current outfit
            if (this.currentOutfit) {
                this.avatar.remove(this.currentOutfit);
                this.currentOutfit = null;
            }
            
            // Load new outfit
            const outfitUrls = [
                'https://models.readyplayer.me/outfits/casual-outfit.glb',
                'https://models.readyplayer.me/outfits/business-outfit.glb',
                'https://models.readyplayer.me/outfits/party-outfit.glb'
            ];
            
            await this.loadOutfit(outfitUrls[outfitIndex]);
            
            this.showLoading(false);
            this.showNotification('Outfit applied! 👔', 'success');
            
        } catch (error) {
            console.error('Failed to load outfit:', error);
            this.showLoading(false);
            this.showNotification('Failed to load outfit. Using default.', 'error');
        }
    }
    
    async loadOutfit(url) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.GLTFLoader();
            
            loader.load(
                url,
                (gltf) => {
                    this.currentOutfit = gltf.scene;
                    
                    // Attach outfit to avatar
                    if (this.avatar) {
                        this.avatar.add(this.currentOutfit);
                    }
                    
                    resolve();
                },
                undefined,
                (error) => {
                    // If outfit loading fails, just continue without it
                    console.warn('Outfit not available:', error);
                    resolve();
                }
            );
        });
    }
    
    // ============================================
    // SAVE AVATAR
    // ============================================
    
    saveAvatar() {
        if (!this.avatar) {
            this.showNotification('No avatar to save!', 'warning');
            return;
        }
        
        // Take screenshot
        this.renderer.render(this.scene, this.camera);
        const screenshot = this.renderer.domElement.toDataURL('image/png');
        
        // Save to localStorage
        const savedAvatars = JSON.parse(localStorage.getItem('savedAvatars') || '[]');
        savedAvatars.push({
            id: Date.now(),
            screenshot: screenshot,
            userData: this.userData,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('savedAvatars', JSON.stringify(savedAvatars));
        
        // Show saved avatars section
        this.displaySavedAvatars();
        
        this.showNotification('Avatar saved successfully! 💾', 'success');
    }
    
    displaySavedAvatars() {
        const section = document.getElementById('savedAvatarsSection');
        const grid = document.querySelector('.saved-avatars-grid');
        
        if (!section || !grid) return;
        
        const savedAvatars = JSON.parse(localStorage.getItem('savedAvatars') || '[]');
        
        if (savedAvatars.length === 0) {
            section.style.display = 'none';
            return;
        }
        
        section.style.display = 'block';
        grid.innerHTML = '';
        
        savedAvatars.reverse().forEach((avatar) => {
            const card = document.createElement('div');
            card.className = 'saved-avatar-card';
            card.innerHTML = `
                <img src="${avatar.screenshot}" alt="Saved Avatar" />
                <div class="saved-avatar-info">
                    <p>${new Date(avatar.timestamp).toLocaleDateString()}</p>
                    <button class="btn btn-sm btn-primary" onclick="avatarGen.loadSavedAvatar(${avatar.id})">
                        Load
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    centerCameraOnAvatar() {
        if (!this.avatar) return;
        
        const box = new THREE.Box3().setFromObject(this.avatar);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = this.camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= 1.5; // Add some padding
        
        this.camera.position.set(center.x, center.y + size.y * 0.3, center.z + cameraZ);
        this.camera.lookAt(center);
        
        if (this.controls) {
            this.controls.target.copy(center);
            this.controls.update();
        }
    }
    
    showLoading(show) {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = show ? 'block' : 'none';
        }
    }
    
    updateProgressBar(percent) {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    onWindowResize() {
        const container = document.getElementById('avatar-canvas-container');
        if (!container) return;
        
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.controls) {
            this.controls.update();
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

let avatarGen;

document.addEventListener('DOMContentLoaded', () => {
    avatarGen = new AvatarGenerator();
    
    // Setup swatch selection
    document.querySelectorAll('.swatch').forEach(swatch => {
        swatch.addEventListener('click', function() {
            // Remove selected class from siblings
            this.parentElement.querySelectorAll('.swatch').forEach(s => {
                s.classList.remove('selected');
            });
            // Add selected class to clicked swatch
            this.classList.add('selected');
        });
    });
    
    // Select first swatch by default
    document.querySelectorAll('.swatches').forEach(swatchGroup => {
        const firstSwatch = swatchGroup.querySelector('.swatch');
        if (firstSwatch) firstSwatch.classList.add('selected');
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .saved-avatar-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: transform 0.3s;
    }
    
    .saved-avatar-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .saved-avatar-card img {
        width: 100%;
        height: 150px;
        object-fit: cover;
    }
    
    .saved-avatar-info {
        padding: 1rem;
        text-align: center;
    }
    
    .saved-avatar-info p {
        margin-bottom: 0.5rem;
        font-size: 0.85rem;
        color: #666;
    }
`;
document.head.appendChild(style);
