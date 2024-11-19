class Pagination {
    constructor(options = {}) {
      this.currentPage = 1;
      this.pageSize = options.pageSize || 10;
      this.totalItems = 0;
      this.data = [];
      this.filteredData = [];
      
      this.initializeElements();
      this.attachEventListeners();
    }
  
    initializeElements() {
      this.elements = {
        firstPage: document.getElementById('first-page'),
        prevPage: document.getElementById('prev-page'),
        nextPage: document.getElementById('next-page'),
        lastPage: document.getElementById('last-page'),
        currentPage: document.getElementById('current-page'),
        totalPages: document.getElementById('total-pages'),
        totalItems: document.getElementById('total-items'),
        pageSize: document.getElementById('page-size')
      };
    }
  
    attachEventListeners() {
      this.elements.firstPage.addEventListener('click', () => this.goToPage(1));
      this.elements.prevPage.addEventListener('click', () => this.goToPage(this.currentPage - 1));
      this.elements.nextPage.addEventListener('click', () => this.goToPage(this.currentPage + 1));
      this.elements.lastPage.addEventListener('click', () => this.goToPage(this.getTotalPages()));
      this.elements.pageSize.addEventListener('change', (e) => {
        this.pageSize = parseInt(e.target.value);
        this.goToPage(1);
      });
    }
  
    setData(data) {
      this.data = data;
      this.filteredData = data;
      this.totalItems = data.length;
      this.updateUI();
    }
  
    filterData(filterFn) {
      this.filteredData = this.data.filter(filterFn);
      this.totalItems = this.filteredData.length;
      this.goToPage(1);
    }
  
    getCurrentPageData() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredData.slice(startIndex, endIndex);
    }
  
    getTotalPages() {
      return Math.ceil(this.totalItems / this.pageSize);
    }
  
    goToPage(page) {
      const totalPages = this.getTotalPages();
      if (page < 1 || page > totalPages) return;
      
      this.currentPage = page;
      this.updateUI();
      
      // Dispatch custom event for page change
      window.dispatchEvent(new CustomEvent('paginationUpdate', {
        detail: {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          data: this.getCurrentPageData()
        }
      }));
    }
  
    updateUI() {
      const totalPages = this.getTotalPages();
      
      // Update text displays
      this.elements.currentPage.textContent = this.currentPage;
      this.elements.totalPages.textContent = totalPages;
      this.elements.totalItems.textContent = this.totalItems;
      
      // Update button states
      this.elements.firstPage.disabled = this.currentPage === 1;
      this.elements.prevPage.disabled = this.currentPage === 1;
      this.elements.nextPage.disabled = this.currentPage === totalPages;
      this.elements.lastPage.disabled = this.currentPage === totalPages;
    }
  }