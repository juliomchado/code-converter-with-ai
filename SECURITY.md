# Security Policy

## 🔒 Security Overview

CodeConverter is designed with security in mind for open source deployment. This document outlines our security practices and how to report vulnerabilities.

## ✅ Security Features

### Data Protection
- **No API keys in source code** - All sensitive data is handled via environment variables
- **Client-side only** - No backend server means no data persistence or logging
- **Local processing** - Code is sent directly to AI providers, not stored on our servers
- **Gitignored secrets** - All `.env` files and sensitive data are excluded from version control

### Deployment Security
- **Environment variables** - API keys are stored securely in Vercel environment variables
- **No data collection** - We don't collect, store, or analyze user code or API keys
- **HTTPS only** - All communication is encrypted
- **Security headers** - Content Security Policy and other security headers are configured

## 🔑 API Key Security

### Recommended Practices
1. **Use environment variables** for production deployments
2. **Never commit API keys** to version control
3. **Rotate keys regularly** as per provider recommendations
4. **Use least privilege** - only grant necessary permissions to API keys

### Supported Storage Methods
1. **Environment Variables** (Most secure - recommended for production)
2. **Local .env file** (Secure for development)
3. **Browser localStorage** (Fallback - consider security implications)

## 🛡️ Vulnerability Reporting

### Reporting Security Issues
If you discover a security vulnerability, please report it privately:

- **Email**: [your-email@domain.com]
- **Subject**: `[SECURITY] CodeConverter Vulnerability Report`
- **Please include**:
  - Description of the vulnerability
  - Steps to reproduce
  - Potential impact
  - Suggested fix (if any)

### Response Timeline
- **Initial response**: Within 24 hours
- **Assessment**: Within 72 hours
- **Fix deployment**: Within 7 days for critical issues

## 🚀 Secure Deployment Guide

### For Vercel
1. Never include actual API keys in your repository
2. Set environment variables in Vercel dashboard:
   ```
   VITE_GEMINI_API_KEY=your_actual_key
   VITE_OPENROUTER_API_KEY=your_actual_key
   ```
3. Use the provided `vercel.json` configuration
4. Enable security headers (included in config)

### For Other Platforms
- Ensure environment variables are properly configured
- Enable HTTPS
- Configure appropriate security headers
- Regular security updates

## 📋 Security Checklist

Before deploying:
- [ ] All API keys are in environment variables
- [ ] `.env` file is gitignored
- [ ] No sensitive data in source code
- [ ] Security headers are configured
- [ ] HTTPS is enabled
- [ ] Dependencies are up to date

## 🔄 Regular Security Maintenance

### Monthly Tasks
- [ ] Review and rotate API keys
- [ ] Update dependencies (`npm audit`)
- [ ] Review access logs (if applicable)
- [ ] Check for new security advisories

### Quarterly Tasks
- [ ] Security policy review
- [ ] Dependency security audit
- [ ] Review deployment configurations

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vercel Security Best Practices](https://vercel.com/docs/security)
- [React Security Best Practices](https://react.dev/learn/keeping-components-pure)

## 📞 Contact

For security-related questions or concerns:
- Email: [your-email@domain.com]
- GitHub Issues: Use for non-sensitive security discussions
- Security Policy: This document (regularly updated)

---

**Last updated**: January 2025  
**Version**: 1.0