
module.exports = {
  showLoading: function () {
    wx.showLoading({ title: '加载中', });
  },
  hideLoading: function () {
    wx.hideLoading();
  },
  showToast: function(title) {
    wx.showToast({ 
      title: title, 
      icon: 'none',
      duration: 2000,  
    });
  },
  showErrorToast: function(title) {
    wx.showToast({ 
      title: title, 
      duration: 2000, 
      image: '/images/warn.png' 
    });
  },
  showSuccessToast: function(title) {
    wx.showToast({
      title: title,
      icon: 'success',
      duration: 2000
    })
  }
}