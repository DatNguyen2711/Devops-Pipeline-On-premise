# FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
# WORKDIR /app
# FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
# ARG BUILD_CONFIGURATION=Release
# WORKDIR /src
# COPY ["Project231/Project231.csproj", "Project231/"]
# RUN dotnet restore "./Project231/Project231.csproj"
# COPY . .
# WORKDIR "/src/Project231"
# RUN dotnet build "./Project231.csproj" -c $BUILD_CONFIGURATION -o /app/build
# FROM build AS publish
# ARG BUILD_CONFIGURATION=Release
# RUN dotnet publish "./Project231.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false
# FROM base AS final
# WORKDIR /app
# COPY --from=publish /app/publish .
# ENTRYPOINT ["dotnet", "Project231.dll"]



FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /App
# Copy everything
COPY . ./
# Restore as distinct layers
RUN dotnet restore
# Build and publish a release
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /App
COPY --from=build-env /App/out .
ENTRYPOINT ["dotnet", "Project231.dll"]
