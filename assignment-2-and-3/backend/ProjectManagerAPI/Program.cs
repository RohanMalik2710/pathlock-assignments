using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProjectManagerAPI.Data;
using ProjectManagerAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// --------------------------------------------------------
// Add services
// --------------------------------------------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --------------------------------------------------------
// Database Context (SQLite local setup)
// --------------------------------------------------------
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") 
                      ?? "Data Source=projectmanager.db"));

// --------------------------------------------------------
// Dependency Injection for Services
// --------------------------------------------------------
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ProjectService>();
builder.Services.AddScoped<SchedulerService>();

// --------------------------------------------------------
// CORS (Allow React Frontend)
// --------------------------------------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// --------------------------------------------------------
// JWT Configuration (Ensure keys are defined in appsettings.json)
// --------------------------------------------------------
var jwtKey = builder.Configuration["Jwt:Key"] ?? "your_super_secret_key_here";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "ProjectManagerAPI";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "ProjectManagerClient";

var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = key,
        ClockSkew = TimeSpan.Zero // Remove default 5-min delay in token expiry
    };
});

// --------------------------------------------------------
// Build the app
// --------------------------------------------------------
var app = builder.Build();

// --------------------------------------------------------
// Middleware pipeline
// --------------------------------------------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
