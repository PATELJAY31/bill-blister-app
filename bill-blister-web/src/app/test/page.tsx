'use client';

import React from 'react';
import StatusChip from '@/components/ui/StatusChip';
import InfoRow from '@/components/ui/InfoRow';
import EmptyState from '@/components/ui/EmptyState';
import { CheckCircleIcon, UserIcon, DocumentTextIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-display text-gray-900 mb-2">Bill Blister Web App</h1>
          <p className="text-body text-gray-600">Professional & Minimal Design System</p>
        </div>
        
        {/* Color Palette */}
        <div className="card">
          <h2 className="text-title text-gray-900 mb-6">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Primary', class: 'bg-primary', text: 'text-white' },
              { name: 'Success', class: 'bg-success', text: 'text-white' },
              { name: 'Warning', class: 'bg-warning', text: 'text-white' },
              { name: 'Error', class: 'bg-error', text: 'text-white' },
              { name: 'Info', class: 'bg-info', text: 'text-white' },
              { name: 'Gray 100', class: 'bg-gray-100', text: 'text-gray-900' },
            ].map((color) => (
              <div key={color.name} className="text-center">
                <div className={`w-16 h-16 ${color.class} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
                  <span className={`text-xs font-medium ${color.text}`}>Aa</span>
                </div>
                <p className="text-small text-gray-600">{color.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="card">
          <h2 className="text-title text-gray-900 mb-6">Typography</h2>
          <div className="space-y-4">
            <div>
              <h1 className="text-display text-gray-900">Display Text</h1>
              <p className="text-caption text-gray-500">text-display - 36px, font-weight: 700</p>
            </div>
            <div>
              <h2 className="text-title text-gray-900">Title Text</h2>
              <p className="text-caption text-gray-500">text-title - 24px, font-weight: 600</p>
            </div>
            <div>
              <h3 className="text-subtitle text-gray-900">Subtitle Text</h3>
              <p className="text-caption text-gray-500">text-subtitle - 18px, font-weight: 500</p>
            </div>
            <div>
              <p className="text-body text-gray-900">Body text for regular content and descriptions.</p>
              <p className="text-caption text-gray-500">text-body - 16px, font-weight: 400</p>
            </div>
            <div>
              <p className="text-caption text-gray-600">Caption text for secondary information.</p>
              <p className="text-caption text-gray-500">text-caption - 14px, font-weight: 400</p>
            </div>
          </div>
        </div>

        {/* Status Chips */}
        <div className="card">
          <h2 className="text-title text-gray-900 mb-6">Status Chips</h2>
          <div className="flex flex-wrap gap-4">
            <StatusChip status="pending" />
            <StatusChip status="approved" />
            <StatusChip status="rejected" />
            <StatusChip status="pending" compact />
            <StatusChip status="approved" compact />
            <StatusChip status="rejected" compact />
          </div>
        </div>

        {/* Buttons */}
        <div className="card">
          <h2 className="text-title text-gray-900 mb-6">Buttons</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-subtitle text-gray-900 mb-3">Primary Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button className="btn btn-primary">Primary Button</button>
                <button className="btn btn-primary btn-sm">Small Primary</button>
                <button className="btn btn-primary btn-lg">Large Primary</button>
              </div>
            </div>
            
            <div>
              <h3 className="text-subtitle text-gray-900 mb-3">Secondary Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button className="btn btn-secondary">Secondary Button</button>
                <button className="btn btn-ghost">Ghost Button</button>
              </div>
            </div>
            
            <div>
              <h3 className="text-subtitle text-gray-900 mb-3">Status Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button className="btn btn-success">Success Button</button>
                <button className="btn btn-warning">Warning Button</button>
                <button className="btn btn-error">Error Button</button>
              </div>
            </div>
          </div>
        </div>

        {/* Form Elements */}
        <div className="card">
          <h2 className="text-title text-gray-900 mb-6">Form Elements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Text Input</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter some text..."
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Select Input</label>
              <select className="form-input">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            
            <div className="form-group md:col-span-2">
              <label className="form-label">Textarea</label>
              <textarea
                className="form-input min-h-[100px] resize-none"
                placeholder="Enter some text..."
              />
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="card">
          <h2 className="text-title text-gray-900 mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card card-hover">
              <h3 className="text-subtitle text-gray-900 mb-2">Interactive Card</h3>
              <p className="text-body text-gray-600">This card has hover effects and is clickable.</p>
            </div>
            
            <div className="card">
              <h3 className="text-subtitle text-gray-900 mb-2">Static Card</h3>
              <p className="text-body text-gray-600">This is a regular card without hover effects.</p>
            </div>
            
            <div className="card card-compact">
              <h3 className="text-subtitle text-gray-900 mb-2">Compact Card</h3>
              <p className="text-body text-gray-600">This card has reduced padding.</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="card">
          <h2 className="text-title text-gray-900 mb-6">Stats Cards</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="stat-label">Total Revenue</p>
                  <p className="stat-value text-primary">₹1,25,000</p>
                </div>
                <CurrencyDollarIcon className="w-8 h-8 text-success" />
              </div>
              <p className="text-caption text-gray-500">+12% from last month</p>
            </div>
            
            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="stat-label">Active Users</p>
                  <p className="stat-value">2,847</p>
                </div>
                <UserIcon className="w-8 h-8 text-info" />
              </div>
              <p className="text-caption text-gray-500">+5% from last week</p>
            </div>
            
            <div className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="stat-label">Documents</p>
                  <p className="stat-value">1,234</p>
                </div>
                <DocumentTextIcon className="w-8 h-8 text-warning" />
              </div>
              <p className="text-caption text-gray-500">+8% from last month</p>
            </div>
          </div>
        </div>

        {/* Info Rows */}
        <div className="card">
          <h2 className="text-title text-gray-900 mb-6">Info Rows</h2>
          <div className="space-y-0">
            <InfoRow
              label="Employee Name"
              value="John Doe"
              icon={<UserIcon className="w-5 h-5" />}
            />
            <InfoRow
              label="Expense Type"
              value="Travel"
              icon={<DocumentTextIcon className="w-5 h-5" />}
            />
            <InfoRow
              label="Amount"
              value="₹1,500.00"
            />
          </div>
        </div>

        {/* Empty State */}
        <div className="card">
          <h2 className="text-title text-gray-900 mb-6">Empty State</h2>
          <EmptyState
            title="No Data Available"
            description="This is an example of the empty state component with a clean, minimal design."
            actionText="Get Started"
            onAction={() => alert('Get started clicked!')}
            secondaryActionText="Learn More"
            onSecondaryAction={() => alert('Learn more clicked!')}
          />
        </div>
      </div>
    </div>
  );
};

export default TestPage;