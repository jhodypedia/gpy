// Sidebar Toggle
$(document).ready(function () {
  $('#toggleSidebar').on('click', function () {
    $('#sidebarMenu').toggleClass('show');
  });

  $('.close-sidebar').on('click', function () {
    $('#sidebarMenu').removeClass('show');
  });
});

// Toastr global options
toastr.options = {
  closeButton: true,
  progressBar: true,
  timeOut: '5000',
  positionClass: 'toast-top-right'
};

// SPA-style AJAX loader
$('a.ajax-link').on('click', function (e) {
  e.preventDefault();
  const url = $(this).attr('href');
  $('#mainContent').html('<div class="text-center p-5"><div class="spinner-border text-primary"></div></div>');
  $.get(url, function (data) {
    const content = $(data).find('#mainContent').html();
    $('#mainContent').html(content);
    history.pushState(null, '', url);
  });
});

// Form submit via AJAX
$('form.ajax-form').on('submit', function (e) {
  e.preventDefault();
  const form = $(this);
  $.post(form.attr('action'), form.serialize(), function (res) {
    toastr.success('Berhasil!');
    if (res.redirect) {
      setTimeout(() => window.location.href = res.redirect, 1500);
    }
  }).fail(function () {
    toastr.error('Gagal memproses permintaan.');
  });
});

// Live invoice checker
function checkInvoiceStatus(invoiceId) {
  setInterval(() => {
    $.get(`/invoice/status/${invoiceId}`, function (res) {
      if (res.status === 'paid') {
        toastr.success('Pembayaran terdeteksi!');
        setTimeout(() => location.href = '/dashboard', 2000);
      }
    });
  }, 5000);
}
