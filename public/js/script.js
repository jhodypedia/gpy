// =====================
// Sidebar Toggle
// =====================
$(document).ready(function () {
  $('#toggleSidebar').on('click', function () {
    $('#sidebarMenu').toggleClass('show');
  });

  $('.close-sidebar').on('click', function () {
    $('#sidebarMenu').removeClass('show');
  });
});

// =====================
// Toastr Global Options
// =====================
toastr.options = {
  closeButton: true,
  progressBar: true,
  timeOut: "5000",
  positionClass: "toast-top-right"
};

// =====================
// SPA Navigation (AJAX SSR-friendly)
// =====================
$(document).on('click', 'a.ajax-link', function (e) {
  e.preventDefault();
  const url = $(this).attr('href');
  $('#mainContent').html('<div class="text-center p-5"><div class="spinner-border text-primary"></div></div>');
  $.get(url, function (data) {
    const content = $(data).find('#mainContent').html();
    $('#mainContent').html(content);
    history.pushState(null, '', url);
  });
});

// Handle browser back/forward
window.onpopstate = function () {
  location.reload();
};

// =====================
// AJAX Form Submit
// =====================
$(document).on('submit', 'form.ajax-form', function (e) {
  e.preventDefault();
  const form = $(this);
  $.post(form.attr('action'), form.serialize())
    .done(function (res) {
      toastr.success('Berhasil!');
      if (res.redirect) window.location.href = res.redirect;
    })
    .fail(function () {
      toastr.error('Gagal memproses permintaan.');
    });
});

// =====================
// Live Invoice Checker
// =====================
function checkInvoiceStatus(invoiceId) {
  const interval = setInterval(() => {
    $.get(`/invoice/status/${invoiceId}`, function (res) {
      if (res.status === 'paid') {
        toastr.success('Pembayaran terdeteksi!');
        clearInterval(interval);
        setTimeout(() => window.location.href = '/dashboard', 2000);
      }
    });
  }, 5000);
}

// =====================
// Optional: Reload partial section
// Usage: <a class="reload-partial" data-target="#section" data-url="/some/partial">Reload</a>
// =====================
$(document).on('click', '.reload-partial', function (e) {
  e.preventDefault();
  const target = $(this).data('target');
  const url = $(this).data('url');
  $(target).html('<div class="text-center p-3"><div class="spinner-border"></div></div>');
  $.get(url, function (data) {
    $(target).html(data);
  });
});
